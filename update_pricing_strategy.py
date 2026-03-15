#!/usr/bin/env python3
"""
Pricing Page 重设计 — 基于 Cursor/Windsurf 定价研究的策略重构
核心变化: BYOK ($9) + Bundled ($29) 双轨制
"""
import json

PEN = "/Users/mac/Desktop/AgentPuter/docs/AgentPuterLandingPage.pen"
with open(PEN, "r") as f:
    doc = json.load(f)

# ══════════════════════════════════════════════════════
# 1. Rebuild Pricing Cards with new strategy
# ══════════════════════════════════════════════════════

# Update Starter card — BYOK
for c in doc["children"]:
    if c.get("id") == "PrPg1":
        for ch in c["children"]:
            if ch.get("id") == "PrCds":
                for card in ch.get("children", []):
                    # Starter → BYOK
                    if card.get("id") == "PrSt":
                        for ci in card.get("children", []):
                            if ci.get("id") == "PrSN":
                                ci["content"] = "STARTER (BYOK)"
                            if ci.get("id") == "PrSD":
                                ci["content"] = "Bring your own API key"
                            if ci.get("id") == "PrSF":
                                ci["content"] = (
                                    "\u2713 1 Pod (always-on)\n"
                                    "\u2713 OpenClaw pre-installed\n"
                                    "\u2713 1 vCPU / 2GB RAM / 20GB SSD\n"
                                    "\u2713 All 15+ channels\n"
                                    "\u2713 Skills & ClawHub\n"
                                    "\u2713 Web Dashboard\n"
                                    "\u2713 SSH access\n"
                                    "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"
                                    "\u2717 AI model NOT included\n"
                                    "  You bring your own API key\n"
                                    "  or Anthropic Pro subscription"
                                )

                    # Pro → Bundled (RECOMMENDED)
                    if card.get("id") == "PrPr":
                        for ci in card.get("children", []):
                            if ci.get("id") == "PrPN":
                                for cii in ci.get("children", []):
                                    if cii.get("id") == "PrPNT":
                                        cii["content"] = "\u2605 BEST VALUE"
                                    if cii.get("id") == "PrPNL":
                                        cii["content"] = "PRO (ALL-IN)"
                            if ci.get("id") == "PrPP":
                                for cii in ci.get("children", []):
                                    pass  # Keep $29
                            if ci.get("id") == "PrPD":
                                ci["content"] = "Everything included. Just talk."
                            if ci.get("id") == "PrPF":
                                ci["content"] = (
                                    "\u2713 1 Pod (always-on)\n"
                                    "\u2713 OpenClaw pre-installed\n"
                                    "\u2713 2 vCPU / 4GB RAM / 40GB SSD\n"
                                    "\u2713 All 15+ channels\n"
                                    "\u2713 Skills & ClawHub\n"
                                    "\u2713 Web Dashboard + API\n"
                                    "\u2713 SSH access + Custom domain\n"
                                    "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"
                                    "\u2713 AI model INCLUDED\n"
                                    "  Claude Sonnet 4.5 bundled\n"
                                    "  ~$20 worth of tokens/month\n"
                                    "  No API key needed"
                                )

                    # Enterprise → Pro+ Multi-agent
                    if card.get("id") == "PrEn":
                        for ci in card.get("children", []):
                            if ci.get("id") == "PrEN":
                                ci["content"] = "TEAM"
                            if ci.get("id") == "PrE$":
                                ci["content"] = "$59"
                            if ci.get("id") == "PrED":
                                ci["content"] = "Multiple agents, more power"
                            if ci.get("id") == "PrEF":
                                ci["content"] = (
                                    "\u2713 3 Pods (always-on)\n"
                                    "\u2713 4 vCPU / 8GB RAM each\n"
                                    "\u2713 100GB SSD each\n"
                                    "\u2713 All 15+ channels\n"
                                    "\u2713 Skills & ClawHub\n"
                                    "\u2713 Priority support\n"
                                    "\u2713 Multi-agent routing\n"
                                    "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"
                                    "\u2713 AI model INCLUDED\n"
                                    "  3x model allocation\n"
                                    "  Claude Opus 4.6 access\n"
                                    "  Bring your own key option"
                                )
                        for ci in card.get("children", []):
                            if ci.get("id") == "PrEBt":
                                for cii in ci.get("children", []):
                                    if cii.get("id") == "PrEBT":
                                        cii["content"] = "Get Started"
        break

# ══════════════════════════════════════════════════════
# 2. Add pricing strategy callout above the cards
# ══════════════════════════════════════════════════════

strategy_callout = {
    "type": "frame", "id": "PrStr",
    "name": "Pricing Strategy Callout",
    "width": "fill_container", "fill": "#0A0A0A",
    "layout": "vertical", "gap": 16, "padding": [0, 60, 24, 60],
    "alignItems": "center",
    "children": [
        {"type": "frame", "id": "PrStrC",
         "fill": "#00FF4108", "cornerRadius": 12,
         "stroke": {"thickness": 1, "fill": "#00FF4120"},
         "padding": [20, 32], "gap": 16,
         "children": [
             {"type": "text", "id": "PrStrT",
              "content": "\U0001f4a1  Two ways to use AgentPuter:",
              "fill": "#FFFFFF", "fontFamily": "Inter", "fontSize": 18, "fontWeight": "bold"},
             {"type": "frame", "id": "PrStrR", "gap": 32,
              "children": [
                  {"type": "frame", "id": "PrStrB", "layout": "vertical", "gap": 4,
                   "children": [
                       {"type": "text", "id": "PrStr1",
                        "content": "BYOK (Bring Your Own Key)",
                        "fill": "#00BFFF", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "600"},
                       {"type": "text", "id": "PrStr1D",
                        "content": "You already have an Anthropic/OpenAI subscription?\nUse it. We just host the infrastructure.",
                        "fill": "#888", "fontFamily": "Inter", "fontSize": 13, "lineHeight": 1.4},
                   ]},
                  {"type": "text", "id": "PrStrOr",
                   "content": "OR",
                   "fill": "#333", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "bold"},
                  {"type": "frame", "id": "PrStrA", "layout": "vertical", "gap": 4,
                   "children": [
                       {"type": "text", "id": "PrStr2",
                        "content": "All-in-One (like Cursor)",
                        "fill": "#00FF41", "fontFamily": "Inter", "fontSize": 14, "fontWeight": "600"},
                       {"type": "text", "id": "PrStr2D",
                        "content": "Don't want to manage API keys?\nWe bundle AI model access. One price, everything works.",
                        "fill": "#888", "fontFamily": "Inter", "fontSize": 13, "lineHeight": 1.4},
                   ]},
              ]},
         ]},
    ]
}

# Insert after hero, before cards
for c in doc["children"]:
    if c.get("id") == "PrPg1":
        cards_idx = None
        for j, ch in enumerate(c["children"]):
            if ch.get("id") == "PrCds":
                cards_idx = j
                break
        if cards_idx is not None:
            c["children"].insert(cards_idx, strategy_callout)
        break

# ══════════════════════════════════════════════════════
# 3. Add value comparison below cards
# ══════════════════════════════════════════════════════

value_comp = {
    "type": "frame", "id": "PrVal",
    "name": "Value Comparison",
    "width": "fill_container", "fill": "#0A0A0A",
    "layout": "vertical", "gap": 16, "padding": [24, 60],
    "children": [
        {"type": "text", "id": "PrValL",
         "content": "// HOW THIS COMPARES",
         "fill": "#00FF41", "fontFamily": "JetBrains Mono", "fontSize": 12,
         "fontWeight": "600", "letterSpacing": 4},
        {"type": "frame", "id": "PrValCards", "gap": 16,
         "children": [
             # vs Cursor
             {"type": "frame", "id": "PrValC1",
              "width": 340, "fill": "#111", "cornerRadius": 10,
              "stroke": {"thickness": 1, "fill": "#222"},
              "layout": "vertical", "gap": 8, "padding": 20,
              "children": [
                  {"type": "text", "id": "PrV1T",
                   "content": "vs Cursor Pro",
                   "fill": "#888", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "600"},
                  {"type": "text", "id": "PrV1P",
                   "content": "$20/mo = AI code editor",
                   "fill": "#EF4444", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "bold"},
                  {"type": "text", "id": "PrV1D",
                   "content": "AgentPuter Pro $29/mo =\n24/7 AI agent + 15 channels + 500 skills\n+ dashboard + always-on computer",
                   "fill": "#4ADE80", "fontFamily": "Inter", "fontSize": 13, "lineHeight": 1.4},
              ]},
             # vs DIY
             {"type": "frame", "id": "PrValC2",
              "width": 340, "fill": "#111", "cornerRadius": 10,
              "stroke": {"thickness": 1, "fill": "#222"},
              "layout": "vertical", "gap": 8, "padding": 20,
              "children": [
                  {"type": "text", "id": "PrV2T",
                   "content": "vs Self-hosting",
                   "fill": "#888", "fontFamily": "Inter", "fontSize": 12, "fontWeight": "600"},
                  {"type": "text", "id": "PrV2P",
                   "content": "$20/mo API + $14/mo VPS = $34",
                   "fill": "#EF4444", "fontFamily": "Inter", "fontSize": 16, "fontWeight": "bold"},
                  {"type": "text", "id": "PrV2D",
                   "content": "AgentPuter Pro $29/mo =\nsame thing but zero config, zero\nmaintenance, zero CGNAT headaches",
                   "fill": "#4ADE80", "fontFamily": "Inter", "fontSize": 13, "lineHeight": 1.4},
              ]},
         ]},
    ]
}

# Insert after cards, before Mac Mini comparison
for c in doc["children"]:
    if c.get("id") == "PrPg1":
        cmp_idx = None
        for j, ch in enumerate(c["children"]):
            if ch.get("id") == "PrCmp":
                cmp_idx = j
                break
        if cmp_idx is not None:
            c["children"].insert(cmp_idx, value_comp)
        break

# ══════════════════════════════════════════════════════
# 4. Rewrite pricing notes with complete strategy
# ══════════════════════════════════════════════════════

pricing_notes = (
    "Pricing Page v6 \u2014 \u5b8c\u6574\u5b9a\u4ef7\u7b56\u7565\n"
    "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\n"
    "\u3010\u6838\u5fc3\u95ee\u9898: \u6211\u4eec\u5e94\u8be5\u63d0\u4f9b API \u670d\u52a1\u5417?\u3011\n\n"
    "\u7814\u7a76\u53d1\u73b0:\n"
    "\u2022 Cursor Pro $20/mo: \u5305\u542b $20 \u7684 API \u7528\u91cf (\u6309token\u8ba1\u8d39)\n"
    "\u2022 Cursor Pro+ $60/mo: 3x \u7528\u91cf\n"
    "\u2022 Cursor Ultra $200/mo: 20x \u7528\u91cf\n"
    "\u2022 Windsurf Pro $15/mo: 500 credits + BYOK\u652f\u6301\n"
    "\u2022 Anthropic Pro: $20/mo (\u8ba2\u9605\u5236, \u975e\u6309token)\n"
    "\u2022 Anthropic API: Sonnet 4.5 = $3/$15 per M tokens\n\n"
    "\u3010\u7ed3\u8bba: \u53cc\u8f68\u5236 (BYOK + Bundled)\u3011\n\n"
    "\u8fd9\u662f\u6700\u4f73\u7b56\u7565, \u56e0\u4e3a:\n\n"
    "\u2460 \u4e3a\u4ec0\u4e48\u8981\u6709 BYOK ($9/mo):\n"
    "   \u2022 OpenClaw \u7528\u6237\u5df2\u7ecf\u6709 Anthropic Pro ($20/mo)\n"
    "   \u2022 \u4ed6\u4eec\u53ea\u9700\u8981\u57fa\u7840\u8bbe\u65bd, \u4e0d\u9700\u8981\u6211\u4eec\u7684API\n"
    "   \u2022 \u6355\u83b7\u201c\u5df2\u6709\u5de5\u5177\u201d\u7684\u5f00\u53d1\u8005\n"
    "   \u2022 \u964d\u4f4e\u8fdb\u5165\u95e8\u69db: $9\u5f00\u59cb\u8bd5\u7528\n"
    "   \u2022 \u6211\u4eec\u96f6API\u98ce\u9669\n\n"
    "\u2461 \u4e3a\u4ec0\u4e48\u8981\u6709 Bundled ($29/mo):\n"
    "   \u2022 \u201c\u4e00\u4e2a\u4ef7\u683c\u5168\u5305\u542b\u201d = \u6700\u4f3c Cursor \u7684\u4f53\u9a8c\n"
    "   \u2022 \u65b0\u7528\u6237\u4e0d\u9700\u8981\u5148\u53bb\u4e70 Anthropic \u8ba2\u9605\n"
    "   \u2022 \u66f4\u9ad8 ARPU ($29 vs $9)\n"
    "   \u2022 \u7b80\u5316 onboarding (0\u914d\u7f6e)\n"
    "   \u2022 \u6211\u4eec\u53ef\u4ee5\u6279\u91cf\u4e70 Anthropic API, \u8d5a\u5dee\u4ef7\n\n"
    "\u2462 \u4e3a\u4ec0\u4e48 $29 \u5408\u7406:\n"
    "   \u2022 Cursor Pro $20/mo \u53ea\u662f\u4e2a\u7f16\u8f91\u5668 + AI\n"
    "   \u2022 AgentPuter Pro $29/mo = 24/7 agent + 15\u6e20\u9053 + 500 skills\n"
    "   \u2022 \u6bd4 Cursor \u591a $9, \u4f46\u4ef7\u503c\u591a\u51e0\u500d\n"
    "   \u2022 \u6bd4\u81ea\u5efa\u4fbf\u5b9c: VPS($14) + API($20) = $34 > $29\n"
    "   \u2022 $29 \u662f\u201c\u4e00\u676f\u5496\u5561\u4e00\u5929\u201d\u7684\u5fc3\u7406\u9608\u503c\n\n"
    "\u3010\u5b9a\u4ef7\u5fc3\u7406\u5b66\u3011\n\n"
    "\u2460 \u951a\u5b9a\u6548\u5e94 (Anchoring):\n"
    "   \u2022 \u5148\u770b Mac Mini $691+/3\u5e74 \u2192 $29/mo \u611f\u89c9\u5f88\u4fbf\u5b9c\n"
    "   \u2022 \u5148\u770b E2B $150/mo \u2192 $29/mo \u611f\u89c9\u5f88\u4fbf\u5b9c\n"
    "   \u2022 Mac Mini \u5bf9\u6bd4\u653e\u5728\u4ef7\u683c\u5361\u7247\u4e0b\u65b9 = \u5b8c\u7f8e\u951a\u70b9\n\n"
    "\u2461 \u8bf1\u9975\u6548\u5e94 (Decoy):\n"
    "   \u2022 BYOK $9 \u4e0d\u542b\u6a21\u578b \u2192 \u8ba9\u201c$29\u5168\u542b\u201d\u770b\u8d77\u6765\u66f4\u503c\n"
    "   \u2022 $9 \u5b58\u5728\u662f\u4e3a\u4e86\u8ba9 $29 \u663e\u5f97\u5408\u7406\n"
    "   \u2022 \u4e5f\u771f\u5b9e\u670d\u52a1\u4e86\u201c\u5df2\u6709key\u201d\u7684\u5f00\u53d1\u8005\n\n"
    "\u2462 \u9ed8\u8ba4\u63a8\u8350 (Default):\n"
    "   \u2022 Pro (ALL-IN) \u6807\u4e3a '\u2605 BEST VALUE'\n"
    "   \u2022 \u89c6\u89c9\u7a81\u51fa (\u7eff\u8272\u8fb9\u6846 + \u5f3a\u8c03\u8272)\n"
    "   \u2022 80%+ \u7528\u6237\u5e94\u8be5\u9009\u8fd9\u4e2a\n\n"
    "\u2463 \u4ef7\u503c\u5bf9\u6bd4 (Value Framing):\n"
    "   \u2022 vs Cursor: $29 > $20, \u4f46\u4ef7\u503c\u591a\u51e0\u500d\n"
    "   \u2022 vs \u81ea\u5efa: $29 < $34 (VPS+API)\n"
    "   \u2022 vs Mac Mini: $29 < $19/mo (\u6446\u9500+\u96a7\u9053)\n\n"
    "\u3010\u6210\u672c\u6a21\u578b (\u6211\u4eec\u7684\u5229\u6da6)\u3011\n\n"
    "BYOK $9/mo:\n"
    "\u2022 \u6210\u672c: \u670d\u52a1\u5668 ~$3-5/mo\n"
    "\u2022 \u5229\u6da6: ~$4-6/mo (44-67%)\n"
    "\u2022 \u96f6API\u98ce\u9669\n\n"
    "Bundled $29/mo:\n"
    "\u2022 \u6210\u672c: \u670d\u52a1\u5668 ~$5-7/mo + API ~$10-15/mo\n"
    "\u2022 \u5229\u6da6: ~$7-14/mo (24-48%)\n"
    "\u2022 \u9700\u8981\u63a7\u5236\u7528\u91cf (\u53ef\u8bbe\u6708\u5ea6\u4e0a\u9650)\n"
    "\u2022 \u5927\u91cf\u4e70API\u53ef\u4ee5\u62ff\u6279\u53d1\u4ef7\n\n"
    "Team $59/mo:\n"
    "\u2022 \u6210\u672c: 3\u670d\u52a1\u5668 ~$15/mo + API ~$30/mo\n"
    "\u2022 \u5229\u6da6: ~$14/mo (24%)\n"
    "\u2022 \u9ad8\u7ea7\u6a21\u578b (Opus 4.6) \u8d35\u4f46\u7528\u6237\u4e5f\u4ed8\u5f97\u66f4\u591a\n\n"
    "\u3010Mac Mini \u5bf9\u6bd4 \u2014 \u4fee\u6b63\u4ef7\u683c + \u8be6\u7ec6\u7f3a\u9677\u3011\n\n"
    "\u4ef7\u683c: $499(\u6298\u6263) / $599(MSRP) / $799(512GB)\n"
    "\u7535\u8d39: ~$4/\u5e74 (4W\u5f85\u673a)\n\n"
    "3\u5e74TCO:\n"
    "\u2022 Mac Mini: $499 + $12 + $180 VPS\u96a7\u9053 = $691+\n"
    "\u2022 AgentPuter Pro: $29 \u00d7 36 = $1,044\n"
    "\u2022 AgentPuter BYOK: $9 \u00d7 36 + $720 API = $1,044\n"
    "\u2022 \u770b\u8d77\u6765 Mac Mini \u4fbf\u5b9c? \u4f46\u52a0\u4e0a\u65f6\u95f4\u6210\u672c...\n\n"
    "\u201c\u65f6\u95f4\u6210\u672c\u201d\u8ba1\u7b97:\n"
    "\u2022 \u521d\u59cb\u914d\u7f6e: 4-8\u5c0f\u65f6\n"
    "\u2022 \u5e74\u5ea6\u7ef4\u62a4: 20+\u5c0f\u65f6 (\u66f4\u65b0+\u6392\u969c+\u91cd\u542f)\n"
    "\u2022 3\u5e74\u603b\u8ba1: 68+\u5c0f\u65f6\n"
    "\u2022 \u6309$50/hr\u5f00\u53d1\u8005\u65f6\u85aa = $3,400\n"
    "\u2022 \u771f\u5b9e\u6210\u672c: $691 + $3,400 = $4,091\n"
    "\u2022 vs AgentPuter: $1,044\n"
    "\u2022 \u8282\u7701: $3,047 (74%)\n\n"
    "\u2192 \u6838\u5fc3\u5356\u70b9\u4e0d\u662f\u201c\u786c\u4ef6\u4fbf\u5b9c\u201d, \u662f\u201c\u65f6\u95f4\u4ef7\u503c\u201d\n\n"
    "8\u5927\u7f3a\u9677:\n"
    "\u2460 CGNAT (\u81f4\u547d) \u2014 \u7aef\u53e3\u8f6c\u53d1\u65e0\u6548, webhook\u4e0d\u901a\n"
    "\u2461 \u52a8\u6001IP \u2014 webhook\u65ad\u5f00, agent\u5931\u8054\n"
    "\u2462 SSL\u8bc1\u4e66 \u2014 \u7aef\u53e380\u88abCGNAT\u5c01\u9501\n"
    "\u2463 Sleep/Wake \u2014 macOS\u7761\u7720bug, agent\u5b95\u673a\n"
    "\u2464 macOS\u66f4\u65b0 \u2014 \u7834\u574fNode.js/Homebrew\n"
    "\u2465 \u6e29\u5ea6 \u2014 \u5c01\u95ed\u7a7a\u95f490\u00b0C\n"
    "\u2466 \u505c\u7535/\u65ad\u7f51 \u2014 ~43\u5c0f\u65f6/\u5e74\u5b95\u673a\n"
    "\u2467 \u65c5\u884c\u65f6 \u2014 \u786c\u4ef6\u6545\u969c\u65e0\u6cd5\u4fee\u590d"
)

for c in doc["children"]:
    if c.get("id") == "PrPg1":
        for ch in c["children"]:
            if ch.get("id") == "NtPr":
                for cc in ch.get("children", []):
                    if cc.get("id") == "NtPrTx":
                        cc["content"] = pricing_notes
                        break
        break

with open(PEN, "w") as f:
    json.dump(doc, f, indent=2, ensure_ascii=False)

print("Done! Pricing strategy v6:")
print("  ✓ Starter (BYOK) $9/mo — infra only, bring your API key")
print("  ✓ Pro (ALL-IN) $29/mo — everything included like Cursor")
print("  ✓ Team $59/mo — 3 Pods + Opus 4.6 access")
print("  ✓ Added pricing strategy callout (BYOK vs All-in-One)")
print("  ✓ Added value comparison (vs Cursor, vs Self-hosting)")
print("  ✓ Complete pricing strategy notes with cost model + psychology")
