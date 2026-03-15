#!/usr/bin/env python3
"""
TinyClaw 图标生成器
生成多个 SVG 变体，输出到 tinyclaw/public/icons/brand/
"""

import os
import math

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../tinyclaw/public/icons/brand")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── 设计 Token ───────────────────────────────────────────────
BG       = "#09090B"
GREEN    = "#7A9E7E"   # 低饱和 sage green
GREEN_DIM = "#5C7A60"  # 更暗一档，用于变体
WHITE    = "#E4E4E7"   # 接近白，用于单色变体
SIZE     = 512
R        = 108         # icon 圆角

# ─── 工具函数 ─────────────────────────────────────────────────
def svg(inner: str, size=SIZE, r=R, bg=BG) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">
  <rect width="{size}" height="{size}" rx="{r}" ry="{r}" fill="{bg}"/>
  {inner}
</svg>"""

def write(name: str, content: str):
    path = os.path.join(OUTPUT_DIR, f"{name}.svg")
    with open(path, "w") as f:
        f.write(content)
    print(f"  ✓  {path}")


# ═══════════════════════════════════════════════════════════════
# V1 — 三条爪痕（stroke-only，细线，低饱和绿）
# ═══════════════════════════════════════════════════════════════
def v1_claw_strokes():
    # 3 条略带弧度的对角线，模拟爪划过的痕迹
    # quadratic bezier: M x1 y1 Q cpx cpy x2 y2
    color = GREEN
    sw    = 15  # stroke-width
    lines = [
        # (x1, y1,  cpx, cpy,  x2,  y2)
        (162, 142,  148, 256,  182, 372),   # 左
        (238, 136,  222, 256,  256, 374),   # 中
        (314, 142,  296, 256,  330, 370),   # 右
    ]
    parts = []
    for x1, y1, cpx, cpy, x2, y2 in lines:
        parts.append(
            f'<path d="M {x1} {y1} Q {cpx} {cpy} {x2} {y2}" '
            f'stroke="{color}" stroke-width="{sw}" stroke-linecap="round" fill="none"/>'
        )
    write("v1_claw_strokes", svg("\n  ".join(parts)))


# ═══════════════════════════════════════════════════════════════
# V2 — 三条爪痕（filled blade，叶形填充）
# ═══════════════════════════════════════════════════════════════
def v2_claw_blades():
    # 每条爪是两端尖的"叶片"形状，用 cubic bezier 构成
    color = GREEN
    cx, cy = 256, 256
    h      = 112   # 半高
    w      = 10    # 半宽（细长比例）
    rot    = -18   # 倾斜角度（度）
    offsets = [-74, 0, 74]  # 三条横向间距

    parts = []
    for dx in offsets:
        x, y = cx + dx, cy
        blade = (
            f'<path '
            f'd="M {x} {y-h} '
            f'C {x+w} {y-h+30} {x+w} {y+h-30} {x} {y+h} '
            f'C {x-w} {y+h-30} {x-w} {y-h+30} {x} {y-h} Z" '
            f'fill="{color}" '
            f'transform="rotate({rot} {x} {y})"/>'
        )
        parts.append(blade)
    write("v2_claw_blades", svg("\n  ".join(parts)))


# ═══════════════════════════════════════════════════════════════
# V3 — 猫爪轮廓（stroke-only，正确深色背景）
# ═══════════════════════════════════════════════════════════════
def v3_paw_stroke():
    color = GREEN
    sw    = 14
    # 主掌垫：底部圆润椭圆
    main = (
        f'<ellipse cx="256" cy="316" rx="90" ry="74" '
        f'stroke="{color}" stroke-width="{sw}" fill="none"/>'
    )
    # 4个趾垫
    toes = [
        (144, 205, 36, 44),   # 左外
        (206, 174, 42, 49),   # 左内
        (304, 174, 42, 49),   # 右内
        (366, 205, 36, 44),   # 右外
    ]
    toe_parts = []
    for tcx, tcy, trx, try_ in toes:
        toe_parts.append(
            f'<ellipse cx="{tcx}" cy="{tcy}" rx="{trx}" ry="{try_}" '
            f'stroke="{color}" stroke-width="{sw}" fill="none"/>'
        )
    inner = main + "\n  " + "\n  ".join(toe_parts)
    write("v3_paw_stroke", svg(inner))


# ═══════════════════════════════════════════════════════════════
# V4 — 爪痕 + 爪印融合（3条stroke爪痕，下方一个小圆掌垫暗示）
# ═══════════════════════════════════════════════════════════════
def v4_claw_plus_pad():
    color = GREEN
    sw    = 13
    # 3条爪痕（偏上）
    lines = [
        (162, 118,  148, 220,  182, 328),
        (238, 112,  222, 220,  256, 330),
        (314, 118,  296, 220,  330, 326),
    ]
    parts = []
    for x1, y1, cpx, cpy, x2, y2 in lines:
        parts.append(
            f'<path d="M {x1} {y1} Q {cpx} {cpy} {x2} {y2}" '
            f'stroke="{color}" stroke-width="{sw}" stroke-linecap="round" fill="none"/>'
        )
    # 底部小掌垫（半透明，暗示来源）
    pad = (
        f'<ellipse cx="256" cy="398" rx="52" ry="40" '
        f'stroke="{color}" stroke-width="10" fill="none" opacity="0.45"/>'
    )
    parts.append(pad)
    write("v4_claw_plus_pad", svg("\n  ".join(parts)))


# ═══════════════════════════════════════════════════════════════
# V5 — 单色白版（用于浅色背景或印刷场景）
# ═══════════════════════════════════════════════════════════════
def v5_white_variant():
    color = WHITE
    sw    = 15
    lines = [
        (162, 142,  148, 256,  182, 372),
        (238, 136,  222, 256,  256, 374),
        (314, 142,  296, 256,  330, 370),
    ]
    parts = []
    for x1, y1, cpx, cpy, x2, y2 in lines:
        parts.append(
            f'<path d="M {x1} {y1} Q {cpx} {cpy} {x2} {y2}" '
            f'stroke="{color}" stroke-width="{sw}" stroke-linecap="round" fill="none"/>'
        )
    write("v5_claw_white", svg("\n  ".join(parts)))


# ═══════════════════════════════════════════════════════════════
# V6 — 透明背景版（favicon / 叠加用）
# ═══════════════════════════════════════════════════════════════
def v6_transparent():
    color = GREEN
    sw    = 16

    def make_inner():
        lines = [
            (162, 142,  148, 256,  182, 372),
            (238, 136,  222, 256,  256, 374),
            (314, 142,  296, 256,  330, 370),
        ]
        parts = []
        for x1, y1, cpx, cpy, x2, y2 in lines:
            parts.append(
                f'<path d="M {x1} {y1} Q {cpx} {cpy} {x2} {y2}" '
                f'stroke="{color}" stroke-width="{sw}" stroke-linecap="round" fill="none"/>'
            )
        return "\n  ".join(parts)

    content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  {make_inner()}
</svg>"""
    path = os.path.join(OUTPUT_DIR, "v6_claw_transparent.svg")
    with open(path, "w") as f:
        f.write(content)
    print(f"  ✓  {path}")


# ═══════════════════════════════════════════════════════════════
# V7 — 极简猫脸（几何线框，stroke-only）
# ═══════════════════════════════════════════════════════════════
def v7_cat_face():
    color = GREEN
    sw    = 14
    # 头部圆
    head = (
        f'<circle cx="256" cy="276" r="128" '
        f'stroke="{color}" stroke-width="{sw}" fill="none"/>'
    )
    # 左耳三角：从头顶圆弧出发，尖峰在左上
    left_ear  = f'<polygon points="192,178 186,72 244,152" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round" fill="none"/>'
    # 右耳三角：对称
    right_ear = f'<polygon points="268,152 326,72 320,178" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round" fill="none"/>'
    # 眼睛：两个小实心圆
    left_eye  = f'<circle cx="212" cy="264" r="10" fill="{color}"/>'
    right_eye = f'<circle cx="300" cy="264" r="10" fill="{color}"/>'
    # 鼻子：小倒三角
    nose      = f'<polygon points="256,294 248,306 264,306" fill="{color}"/>'
    # 胡须：左3根右3根，细线
    whiskers  = []
    for i, (x1, y1, x2, y2) in enumerate([
        (128, 290, 214, 296), (124, 308, 214, 306), (130, 326, 214, 316),  # 左
        (298, 296, 384, 290), (298, 306, 388, 308), (298, 316, 382, 326),  # 右
    ]):
        whiskers.append(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" '
            f'stroke="{color}" stroke-width="8" stroke-linecap="round" opacity="0.6"/>'
        )
    inner = "\n  ".join([head, left_ear, right_ear, left_eye, right_eye, nose] + whiskers)
    write("v7_cat_face", svg(inner))


# ═══════════════════════════════════════════════════════════════
# V8 — 猫脸 + 爪痕叠加（拟人 × 抽象融合）
# ═══════════════════════════════════════════════════════════════
def v8_cat_face_with_claws():
    color    = GREEN
    claw_col = GREEN_DIM
    sw       = 13
    # 猫脸（简化版：只保留头 + 耳 + 眼）
    head      = f'<circle cx="256" cy="280" r="120" stroke="{color}" stroke-width="{sw}" fill="none"/>'
    left_ear  = f'<polygon points="196,184 190,78 244,156" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round" fill="none"/>'
    right_ear = f'<polygon points="268,156 322,78 316,184" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round" fill="none"/>'
    left_eye  = f'<circle cx="216" cy="268" r="9" fill="{color}"/>'
    right_eye = f'<circle cx="296" cy="268" r="9" fill="{color}"/>'
    # 右侧脸颊上叠加两条小爪痕（像被抓过的纹路）
    claw_marks = [
        f'<path d="M 318 228 Q 308 256 320 282" stroke="{claw_col}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>',
        f'<path d="M 334 222 Q 324 252 336 278" stroke="{claw_col}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.7"/>',
    ]
    inner = "\n  ".join([head, left_ear, right_ear, left_eye, right_eye] + claw_marks)
    write("v8_cat_claws", svg(inner))


# ═══════════════════════════════════════════════════════════════
# V9 — 迷你爪子（伸出的小爪手，拟人化）
# ═══════════════════════════════════════════════════════════════
def v9_reaching_claw():
    color = GREEN
    sw    = 13
    # 手掌轮廓：底部圆润，顶部伸出3根手指/爪
    # 掌心：圆角矩形近似（用路径）
    palm = (
        f'<path d="M 196 340 Q 196 404 256 408 Q 316 404 316 340 L 316 290 Q 316 272 296 272 '
        f'Q 276 272 276 290 L 276 270 Q 276 250 256 250 Q 236 250 236 270 L 236 290 '
        f'Q 236 272 216 272 Q 196 272 196 290 Z" '
        f'stroke="{color}" stroke-width="{sw}" stroke-linejoin="round" fill="none"/>'
    )
    # 三个爪尖：每个手指顶端延伸出尖锐小钩
    claws = [
        # 左指爪尖
        f'<path d="M 206 272 Q 194 250 202 232" stroke="{color}" stroke-width="10" stroke-linecap="round" fill="none"/>',
        # 中指爪尖
        f'<path d="M 256 250 Q 248 228 256 210" stroke="{color}" stroke-width="10" stroke-linecap="round" fill="none"/>',
        # 右指爪尖
        f'<path d="M 306 272 Q 318 250 310 232" stroke="{color}" stroke-width="10" stroke-linecap="round" fill="none"/>',
    ]
    inner = "\n  ".join([palm] + claws)
    write("v9_reaching_claw", svg(inner))


# ═══════════════════════════════════════════════════════════════
# V10 — 极简猫脸（无胡须，更icon化，填充耳朵内三角）
# ═══════════════════════════════════════════════════════════════
def v10_cat_minimal():
    color = GREEN
    sw    = 14
    # 头：实心填充暗色圆 + 描边（使图形更紧凑）
    head = (
        f'<circle cx="256" cy="278" r="130" fill="#111115" stroke="{color}" stroke-width="{sw}"/>'
    )
    # 耳朵：填充
    left_ear  = f'<polygon points="190,180 184,70 246,154" fill="#111115" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round"/>'
    right_ear = f'<polygon points="266,154 328,70 322,180" fill="#111115" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round"/>'
    # 耳内小三角（muted，暗示内耳）
    left_inner  = f'<polygon points="202,168 200,104 232,152" fill="{GREEN_DIM}" opacity="0.5"/>'
    right_inner = f'<polygon points="280,152 312,104 310,168" fill="{GREEN_DIM}" opacity="0.5"/>'
    # 眼睛：杏仁形（闭眼/眯眼线条）
    left_eye  = f'<path d="M 200 268 Q 214 252 228 268" stroke="{color}" stroke-width="11" stroke-linecap="round" fill="none"/>'
    right_eye = f'<path d="M 284 268 Q 298 252 312 268" stroke="{color}" stroke-width="11" stroke-linecap="round" fill="none"/>'
    # 鼻子
    nose = f'<polygon points="256,296 249,308 263,308" fill="{color}"/>'
    inner = "\n  ".join([head, left_ear, right_ear, left_inner, right_inner, left_eye, right_eye, nose])
    write("v10_cat_minimal", svg(inner))


# ─── 执行 ─────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n🐾  TinyClaw Icon Generator\n")
    print("── 抽象系 ──")
    v1_claw_strokes()
    v2_claw_blades()
    v3_paw_stroke()
    v4_claw_plus_pad()
    v5_white_variant()
    v6_transparent()
    print("── 拟人系 ──")
    v7_cat_face()
    v8_cat_face_with_claws()
    v9_reaching_claw()
    v10_cat_minimal()
    print(f"\n✅  全部输出到 {OUTPUT_DIR}\n")
