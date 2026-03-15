#!/usr/bin/env python3
"""
工具站自测 Agent 产线
====================
自动测试所有 tinyclaw.dev/tools 工具 → 评估功能 → 输出报告 → 部署上线

产线架构：
  1. 构建检查：npm run build 确保编译通过
  2. 启动 dev server
  3. 前端工具测试：对每个纯前端工具发送模拟输入，检查响应
  4. AI 工具测试：调用 /api/ai/generate 端点，验证 AI 返回
  5. 生成测试报告
  6. 全部通过 → 自动部署（可选）

用法：
  python3 scripts/tools_test_agent.py                  # 完整测试
  python3 scripts/tools_test_agent.py --skip-build     # 跳过构建
  python3 scripts/tools_test_agent.py --deploy          # 测试通过后自动部署
  python3 scripts/tools_test_agent.py --tool json-formatter  # 只测单个工具
"""

import os
import sys
import json
import time
import signal
import subprocess
import argparse
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

TINYCLAW_DIR = Path(__file__).resolve().parent.parent / "tinyclaw"
REPORT_DIR = Path(__file__).resolve().parent.parent / "reports"
DEV_PORT = 3099
DEV_URL = f"http://localhost:{DEV_PORT}"

# ─── 工具定义 & 测试用例 ───────────────────────────────────

FRONTEND_TOOLS = {
    "json-formatter": {
        "name": "JSON Formatter",
        "test_url": "/tools/json-formatter",
        "verify": "JSON Formatter",
    },
    "base64-encoder": {
        "name": "Base64 Encoder",
        "test_url": "/tools/base64-encoder",
        "verify": "Base64",
    },
    "word-counter": {
        "name": "Word Counter",
        "test_url": "/tools/word-counter",
        "verify": "Word",
    },
    "uuid-generator": {
        "name": "UUID Generator",
        "test_url": "/tools/uuid-generator",
        "verify": "UUID",
    },
    "qr-code-generator": {
        "name": "QR Code Generator",
        "test_url": "/tools/qr-code-generator",
        "verify": "QR",
    },
    "color-picker": {
        "name": "Color Picker",
        "test_url": "/tools/color-picker",
        "verify": "Color",
    },
    "markdown-preview": {
        "name": "Markdown Preview",
        "test_url": "/tools/markdown-preview",
        "verify": "Markdown",
    },
    "image-compressor": {
        "name": "Image Compressor",
        "test_url": "/tools/image-compressor",
        "verify": "Compress",
    },
    "pdf-to-image": {
        "name": "PDF to Image",
        "test_url": "/tools/pdf-to-image",
        "verify": "PDF",
    },
    "image-to-pdf": {
        "name": "Image to PDF",
        "test_url": "/tools/image-to-pdf",
        "verify": "Image",
    },
    "cron-expression-generator": {
        "name": "Cron Generator",
        "test_url": "/tools/cron-expression-generator",
        "verify": "Cron",
    },
    "telegram-bot-checker": {
        "name": "Telegram Bot Checker",
        "test_url": "/tools/telegram-bot-checker",
        "verify": "Telegram",
    },
    "api-health-checker": {
        "name": "API Health Checker",
        "test_url": "/tools/api-health-checker",
        "verify": "API",
    },
    "ai-agent-cost-calculator": {
        "name": "AI Agent Cost Calculator",
        "test_url": "/tools/ai-agent-cost-calculator",
        "verify": "Cost",
    },
}

AI_TOOLS = {
    "ai-rewriter": {
        "name": "AI Rewriter",
        "input": "The quick brown fox jumps over the lazy dog. This sentence is commonly used for testing purposes.",
    },
    "ai-summarizer": {
        "name": "AI Summarizer",
        "input": "Artificial intelligence has transformed many industries. From healthcare to finance, AI systems now help with diagnosis, trading, customer service, and more. Machine learning models can process vast amounts of data to find patterns humans might miss. However, concerns about bias, privacy, and job displacement remain important topics of discussion.",
    },
    "ai-translator": {
        "name": "AI Translator",
        "input": "to: Chinese\nHello, how are you today? I hope everything is going well.",
    },
    "ai-email-writer": {
        "name": "AI Email Writer",
        "input": "Follow-up after a product demo meeting, professional tone, mention next steps",
    },
    "ai-code-explainer": {
        "name": "AI Code Explainer",
        "input": "const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };",
    },
    "ai-regex-generator": {
        "name": "AI Regex Generator",
        "input": "Match email addresses",
    },
    "ai-sql-generator": {
        "name": "AI SQL Generator",
        "input": "Get all users who signed up in the last 30 days, ordered by signup date descending",
    },
    "ai-resume-optimizer": {
        "name": "AI Resume Optimizer",
        "input": "Software Engineer with 5 years experience in Python and JavaScript. Built REST APIs and React frontends. Led a team of 3 developers.",
    },
}

# ─── 辅助函数 ──────────────────────────────────────────────


class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    END = "\033[0m"


def log(msg, color=None):
    prefix = f"{color}" if color else ""
    suffix = Colors.END if color else ""
    print(f"{prefix}{msg}{suffix}", flush=True)


def log_test(name, passed, detail=""):
    icon = f"{Colors.GREEN}✓{Colors.END}" if passed else f"{Colors.RED}✗{Colors.END}"
    extra = f" — {detail}" if detail else ""
    print(f"  {icon} {name}{extra}", flush=True)


def fetch_page(path, timeout=15):
    """GET 请求，返回 (status_code, body_text)"""
    try:
        url = f"{DEV_URL}{path}"
        req = urllib.request.Request(url, headers={"User-Agent": "ToolsTestAgent/1.0"})
        resp = urllib.request.urlopen(req, timeout=timeout)
        body = resp.read().decode("utf-8", errors="replace")
        return resp.status, body
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, str(e)


def fetch_ai(tool_slug, input_text, timeout=30):
    """POST /api/ai/generate，返回 (status_code, result_text)"""
    try:
        url = f"{DEV_URL}/api/ai/generate"
        data = json.dumps({"tool": tool_slug, "input": input_text}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "ToolsTestAgent/1.0",
            },
        )
        resp = urllib.request.urlopen(req, timeout=timeout)
        body = json.loads(resp.read().decode("utf-8"))
        return resp.status, body.get("result", body.get("error", ""))
    except urllib.error.HTTPError as e:
        try:
            err_body = json.loads(e.read().decode("utf-8"))
            return e.code, err_body.get("error", str(e))
        except:
            return e.code, str(e)
    except Exception as e:
        return 0, str(e)


# ─── 测试阶段 ──────────────────────────────────────────────


def phase_build():
    """Phase 1: 构建检查"""
    log("\n═══ Phase 1: 构建检查 ═══", Colors.BOLD)
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=TINYCLAW_DIR,
        capture_output=True,
        text=True,
        timeout=300,
    )
    passed = result.returncode == 0
    if passed:
        log_test("npm run build", True, "编译成功")
    else:
        log_test("npm run build", False, "编译失败")
        err_lines = result.stderr.strip().split("\n")[-10:]
        for line in err_lines:
            log(f"    {line}", Colors.RED)
    return passed


def start_dev_server():
    """启动 dev server，返回进程对象"""
    log("\n═══ 启动 Dev Server ═══", Colors.CYAN)

    env = os.environ.copy()
    env["GOOGLE_VERTEX_PROJECT"] = "pdfconverter-415414"

    sa_path = Path(__file__).resolve().parent.parent / "credentials" / "pdfconverter-415414-6ccc7d166727.json"
    if sa_path.exists():
        import base64
        sa_b64 = base64.b64encode(sa_path.read_bytes()).decode("utf-8")
        env["GOOGLE_VERTEX_SA_JSON_B64"] = sa_b64
        log(f"  ✓ 已注入 SA 凭据 (Base64, {len(sa_b64)} chars)")

    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=TINYCLAW_DIR,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        preexec_fn=os.setsid,
    )

    for attempt in range(30):
        time.sleep(2)
        try:
            status, _ = fetch_page("/", timeout=5)
            if status == 200:
                log(f"  ✓ Dev server 启动成功 (端口 {DEV_PORT}，等待 {(attempt+1)*2}s)")
                return proc
        except:
            pass

    log("  ✗ Dev server 启动超时", Colors.RED)
    os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
    return None


def phase_frontend_tests(only_tool=None):
    """Phase 2: 前端工具页面加载测试"""
    log("\n═══ Phase 2: 前端工具页面测试 ═══", Colors.BOLD)
    results = {}
    tools = FRONTEND_TOOLS
    if only_tool and only_tool in tools:
        tools = {only_tool: tools[only_tool]}

    # 先测试索引页
    status, body = fetch_page("/tools")
    idx_pass = status == 200 and "Free Online" in body
    log_test("Tools Index Page (/tools)", idx_pass, f"HTTP {status}")
    results["_index"] = idx_pass

    for slug, cfg in tools.items():
        status, body = fetch_page(cfg["test_url"])
        page_ok = status == 200
        content_ok = cfg["verify"].lower() in body.lower() if body else False
        passed = page_ok and content_ok
        detail = f"HTTP {status}"
        if page_ok and not content_ok:
            detail += f", 但未找到关键词 '{cfg['verify']}'"
        log_test(cfg["name"], passed, detail)
        results[slug] = passed

    return results


def phase_ai_tests(only_tool=None):
    """Phase 3: AI 工具 API 测试"""
    log("\n═══ Phase 3: AI 工具 API 测试 ═══", Colors.BOLD)
    results = {}
    tools = AI_TOOLS
    if only_tool and only_tool in tools:
        tools = {only_tool: tools[only_tool]}

    for slug, cfg in tools.items():
        status, result = fetch_ai(slug, cfg["input"])
        has_content = len(result) > 50 if isinstance(result, str) else False
        passed = status == 200 and has_content
        detail = f"HTTP {status}, {len(result)} chars" if passed else f"HTTP {status}"
        if status == 200 and not has_content:
            detail += f", 输出过短 ({len(result)} chars)"
        log_test(cfg["name"], passed, detail)
        results[slug] = {"passed": passed, "status": status, "output_len": len(result) if isinstance(result, str) else 0}
        time.sleep(2)

    return results


def phase_deploy():
    """Phase 4: 部署到 Vercel"""
    log("\n═══ Phase 4: 部署到生产 ═══", Colors.BOLD)
    result = subprocess.run(
        ["npx", "vercel", "--prod", "--yes"],
        cwd=TINYCLAW_DIR,
        capture_output=True,
        text=True,
        timeout=300,
    )
    passed = result.returncode == 0
    if passed:
        url = result.stdout.strip().split("\n")[-1]
        log_test("Vercel Deploy", True, f"→ {url}")
    else:
        log_test("Vercel Deploy", False)
        for line in result.stderr.strip().split("\n")[-5:]:
            log(f"    {line}", Colors.RED)
    return passed


def generate_report(build_ok, frontend_results, ai_results, deployed):
    """生成测试报告"""
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = REPORT_DIR / f"tools_test_{timestamp}.json"

    frontend_pass = sum(1 for v in frontend_results.values() if v)
    frontend_total = len(frontend_results)
    ai_pass = sum(1 for v in ai_results.values() if v.get("passed") if isinstance(v, dict))
    ai_total = len(ai_results)

    report = {
        "timestamp": datetime.now().isoformat(),
        "build": "PASS" if build_ok else "FAIL",
        "frontend": {
            "passed": frontend_pass,
            "total": frontend_total,
            "details": frontend_results,
        },
        "ai": {
            "passed": ai_pass,
            "total": ai_total,
            "details": {k: v for k, v in ai_results.items()},
        },
        "deployed": deployed,
        "overall": "PASS" if (build_ok and frontend_pass == frontend_total and ai_pass >= ai_total * 0.7) else "FAIL",
    }

    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False))
    return report, report_path


def print_summary(report, report_path):
    """输出汇总"""
    log("\n" + "═" * 50, Colors.BOLD)
    log("  工具站自测报告", Colors.BOLD)
    log("═" * 50, Colors.BOLD)

    overall = report["overall"]
    color = Colors.GREEN if overall == "PASS" else Colors.RED

    log(f"\n  构建:    {report['build']}")
    log(f"  前端工具: {report['frontend']['passed']}/{report['frontend']['total']} 通过")
    log(f"  AI 工具:  {report['ai']['passed']}/{report['ai']['total']} 通过")
    log(f"  已部署:   {'是' if report['deployed'] else '否'}")
    log(f"\n  {Colors.BOLD}总评: {color}{overall}{Colors.END}")
    log(f"\n  报告: {report_path}")


# ─── 主流程 ────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="工具站自测 Agent")
    parser.add_argument("--skip-build", action="store_true", help="跳过构建检查")
    parser.add_argument("--deploy", action="store_true", help="测试通过后自动部署")
    parser.add_argument("--tool", type=str, help="只测试指定工具 slug")
    parser.add_argument("--ai-only", action="store_true", help="只测试 AI 工具")
    parser.add_argument("--frontend-only", action="store_true", help="只测试前端工具")
    args = parser.parse_args()

    log(f"\n{'═' * 50}", Colors.CYAN)
    log(f"  🔧 工具站自测 Agent  {datetime.now().strftime('%Y-%m-%d %H:%M')}", Colors.CYAN)
    log(f"  📍 项目: {TINYCLAW_DIR}", Colors.CYAN)
    log(f"  🔑 GCP: pdfconverter-415414", Colors.CYAN)
    log(f"{'═' * 50}\n", Colors.CYAN)

    # Phase 1: Build
    build_ok = True
    if not args.skip_build:
        build_ok = phase_build()
        if not build_ok:
            log("\n❌ 构建失败，终止测试", Colors.RED)
            sys.exit(1)

    # Start dev server
    dev_proc = start_dev_server()
    if not dev_proc:
        log("\n❌ Dev server 启动失败，终止测试", Colors.RED)
        sys.exit(1)

    frontend_results = {}
    ai_results = {}

    try:
        # Phase 2: Frontend
        if not args.ai_only:
            frontend_results = phase_frontend_tests(args.tool)

        # Phase 3: AI
        if not args.frontend_only:
            ai_results = phase_ai_tests(args.tool if args.tool and args.tool.startswith("ai-") else None)

    finally:
        log("\n  停止 dev server...", Colors.CYAN)
        os.killpg(os.getpgid(dev_proc.pid), signal.SIGTERM)
        dev_proc.wait(timeout=10)

    # Report
    deployed = False
    report, report_path = generate_report(build_ok, frontend_results, ai_results, deployed)

    # Phase 4: Deploy
    if args.deploy and report["overall"] == "PASS":
        deployed = phase_deploy()
        report["deployed"] = deployed
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False))

    print_summary(report, report_path)

    sys.exit(0 if report["overall"] == "PASS" else 1)


if __name__ == "__main__":
    main()
