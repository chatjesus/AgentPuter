---
title: "Who Actually Makes Money From OpenClaw?"
description: "100K GitHub stars, 2M weekly visitors, $0 revenue. The AI Agent gold rush has a business model problem — and the answer will define who wins the platform race."
date: "2026-02-15"
author: "AgentPuter Lab"
readingTime: "15 min"
tags: ["OpenClaw", "Business Model", "AI Agent", "Agent Platform", "AgentPuter", "Infrastructure"]
featured: true
---

Over the past five posts, we've dissected OpenClaw from every angle — the architecture, the security holes, the Skills ecosystem, the office automation benchmarks, the cultural phenomenon. One question kept coming up in every conversation: who actually makes money here?

Not the philosophical version of that question. The literal one. Let's follow the money.

---

## I. The Most Valuable Free Product in AI

OpenClaw's growth has no precedent. The project crossed 100,000 GitHub stars faster than any open-source repo in history — faster than Kubernetes, faster than VS Code — and kept climbing past 190,000 in under two months. Its website pulls over 2 million unique visitors per week.

Yet OpenClaw has zero dollars in revenue. Its creator, Peter Steinberger, rejected billion-dollar acquisition offers from both Meta and OpenAI. Zuckerberg reached out personally via WhatsApp. Sam Altman engaged from OpenAI's side; Satya Nadella coordinated from Microsoft's. The deals would have made Steinberger one of the wealthiest independent developers on the planet. He turned them all down.

While VCs and Big Tech salivate, Steinberger is personally losing between $10,000 and $20,000 per month on infrastructure costs, support staff, and legal fees. Meanwhile, his users are spending fortunes. A power user running a small fleet of Clawdbots can easily burn through $30 to $800 per month in API calls. That money flows directly to Anthropic, OpenAI, and Google. None of it goes to OpenClaw.

**Value creation versus value capture — the gap has never been this wide.** Hundreds of thousands of developers run OpenClaw daily. The model providers collect the checks. OpenClaw collects nothing.

---

## II. Where The Money Actually Goes (The Value Chain)

Map the flow of a single dollar through the OpenClaw ecosystem.

Say a user wants to automate their marketing reports. They download the open-source OpenClaw software, which costs them $0. They browse ClawHub for a "Google Analytics Reporting" skill and find one of the 3,286 free skills available. They install it for $0. They deploy the agent on a cloud VM or a managed hosting provider, costing them anywhere from $0 (on a free tier) to perhaps $17 per month for a basic setup.

Then, the agent starts working. It makes hundreds of API calls to Claude 3.5 Sonnet or GPT-4o to reason, plan, and generate its report. This is where the meter runs. The user's credit card is charged $30, $100, or even $800 by the end of the month. The entire economic output of the agent's work flows to the LLM provider.

Here's where the money goes:

| Recipient | What They Provide | What The User Pays |
|-----------|-------------------|--------------------|
| **Anthropic / OpenAI** | LLM API tokens | **$30 - $800/mo** |
| **Hosting provider** | VM / managed runtime | $0 - $17/mo |
| **OpenClaw** | The entire agent framework | $0 |
| **ClawHub skill dev** | The skill that makes it useful | $0 |

That's it. The platform that makes the whole thing possible sits at $0.

This is fundamentally different from any successful platform before it. Apple built a hardware and software ecosystem, then placed a 30% toll booth (the App Store) on all commerce. Google gave away Android but monetized it through search and advertising, the default gateways to the internet. WordPress.org is free, but its corporate sponsor, Automattic, built a multi-billion dollar business on hosting (WordPress.com) and VIP enterprise services.

**OpenClaw currently has no toll booth.** It created a superhighway for value to travel from users to LLM providers, but built no off-ramps for itself. Everyone in the chain gets paid except the platform that makes it all possible.

---

## III. Steinberger's Bet: The Linux Playbook

Why turn down a billion-dollar exit for a project that bleeds cash? Steinberger's answer is consistent: he doesn't want to be a CEO again, and he thinks AI agents are too important to be owned by a single corporation.

His strategic precedent is clear: Linus Torvalds and the Linux kernel. Torvalds never directly monetized Linux. He placed it under the GPLv2 license and entrusted its future to a non-profit, the Linux Foundation. He maintained technical control but relinquished financial control, enabling an entire ecosystem to flourish. That "free" kernel now underpins the entire cloud, the Android ecosystem, and generated the commercial opportunities that led to Red Hat's $34 billion acquisition by IBM.

OpenClaw is currently funded like a non-profit, not a business. Sponsorships range from the $5/month "Krill" tier to the $500/month "Poseidon" tier. The Cline Foundation provided a $1 million grant to fund third-party development, with no equity taken. OpenAI provides token subsidies to the core team for research. This patchwork of funding covers basic maintenance and server costs, but it's a charity model, not a business model. It cannot fund a global sales team, a 24/7 security operations center, or an R&D division to compete with Google's and Meta's agent labs.

This strategy carries an immense risk that the Linux kernel, with its thousands of corporate contributors, never had. **The bus factor for the OpenClaw project is one.** The entire enterprise, from strategic direction to key commits, rests on Steinberger's shoulders. This is not a sustainable model for infrastructure that aims to be the foundation of a new computing paradigm.

---

## IV. Three Business Models That Could Work

The sponsorship model won't scale. At some point, OpenClaw — or someone building on top of it — has to capture value. Three models have historical precedent.

### A. Red Hat Model — Enterprise Support & Security

The most proven playbook for commercializing critical open-source infrastructure is the enterprise model. The core software remains free and open-source, but businesses pay for reliability, security, and support. Red Hat didn't sell Linux; it sold Red Hat Enterprise Linux, a hardened, certified, and supported version with guaranteed SLAs.

For OpenClaw, this would mean a paid "OpenClaw Enterprise" offering. While a startup can tolerate a self-hosted agent occasionally failing, a Fortune 500 company cannot. Enterprises will pay a premium for features like SOC 2 compliance, SAML/SSO integration, detailed audit logging for compliance, guaranteed uptime SLAs, and 24/7 dedicated support from expert engineers.

This market is already emerging. A handful of small companies offer managed OpenClaw hosting for as little as $17/month, but none are operating at the scale or security level required by large enterprises. **The core insight here is that the agent itself is free, but enterprise-grade reliability is a product that costs money.** The $34 billion IBM paid for Red Hat is the ultimate proof of this model's power.

### B. App Store Model — ClawHub Marketplace

ClawHub is OpenClaw's official skill repository, a parallel to the iOS App Store or the Chrome Web Store. It's seen explosive growth, with 3,286 skills and over 1.5 million total downloads. Currently, every skill is free. The obvious business model is to create a marketplace, allowing developers to sell powerful, proprietary skills and taking a cut of the transaction.

Apple proved that if you build the distribution channel and a layer of trust, you can command up to a 30% take rate. However, OpenClaw has a critical problem: it has distribution, but it has lost trust. The "ClawHavoc" incident in January 2026 exposed the danger of an unvetted repository. An attacker using the handle "hightower6eu" published 314 poisoned skills that contained the Atomic Stealer malware, resulting in over 7,000 downloads before being detected.

Koi Security's audit of 2,857 ClawHub skills found 341 — a staggering 11.9% — were actively malicious or contained severe vulnerabilities. A separate Snyk audit scanned 3,984 skills and found another 283 (7.1%) leaked user credentials or API keys through insecure logging. **You cannot charge for distribution on a platform where 1 in 9 apps is actively hostile.**

The path forward requires rebuilding trust. This likely means a two-tier system: a free, "use-at-your-own-risk" community tier, and a paid, "ClawHub Verified" tier where skills undergo rigorous security audits. Developers would pay to have their skills audited and listed in the premium store, and OpenClaw could take a percentage of sales. This mirrors the model of npm, which is free, while its parent company generates over $100 million annually from enterprise products like npm Enterprise and Artifactory that provide security and package management.

### C. Agent-as-a-Service — Moltbook & Beyond

The third model is further out. Instead of selling support or skills, the platform becomes the broker for an agent-to-agent economy. Agents don't just call human-facing APIs — they discover services offered by other agents, negotiate terms, and transact. The platform takes a cut of every machine-to-machine transaction.

The launch of Moltbook — a social network built exclusively for AI agents — gave a glimpse of this potential. It hit 30,000 agents on launch day, crossed 150,000 by day three, and surpassed 1.5 million registered agents within the first week. Agents were posting, commenting, voting, and forming communities autonomously.

The reality was what Andrej Karpathy called "a dumpster fire" — though he acknowledged the sheer scale was "unprecedented." The agents' negotiation protocols were brittle, they got stuck in loops, and the economic activity was negligible. The vision of a self-organizing agent economy is powerful, but the underlying technology for robust agent-to-agent negotiation and value exchange is still in its infancy. This is a 2-to-3-year play, not a 2026 revenue stream.

| Model                     | Revenue Type              | Time to Market | Defensibility                          | Key Risk                                   |
| ------------------------- | ------------------------- | -------------- | -------------------------------------- | ------------------------------------------ |
| **A. Enterprise Support** | Recurring Subscription    | 6-12 Months    | High (Sticky, high switching costs)    | Slow sales cycle, requires enterprise DNA  |
| **B. ClawHub Marketplace**| Transaction % / Listing Fee | 12-18 Months   | Medium (Network effects)               | Rebuilding trust after ClawHavoc           |
| **C. Agent-as-a-Service** | Transaction % (Micropayments) | 2-4 Years      | Very High (Protocol-level lock-in)     | Core technology is not ready ("dumpster fire") |

---

## V. The Infrastructure Play — Where The Real Money Is

There's a pattern in open-source economics that shows up every decade. The core innovation — the kernel, the container, the CMS — stays free. The money moves to whoever makes it reliable, scalable, and secure enough for business.

Look at Linux. The kernel is the quintessential free software success story. But the enterprise value was captured by Red Hat, which built a $34 billion business on support, certification, and tooling before its acquisition by IBM. The cloud giants—AWS, Azure, and GCP—built their empires by offering Linux as a managed, elastic service, capturing hundreds of billions in value. The pattern repeated with containers: Docker democratized them, but Kubernetes orchestrated them at scale, giving rise to a multi-billion dollar ecosystem of managed services (GKE, EKS, AKS) and observability platforms like Datadog and security tools from HashiCorp. WordPress powers 43% of the web for free, yet Automattic hit a $7.5 billion valuation in 2021 and hosting companies like WP Engine built substantial businesses providing the managed infrastructure around it.

AI Agents are next. OpenClaw is the kernel, but enterprises won't run it raw. They require an entire stack of infrastructure:

*   **Runtime:** Agents need a secure, sandboxed environment to execute code generated by non-deterministic LLMs. This means robust resource isolation, ephemeral sessions, and guaranteed 24/7 uptime. Think Firecracker, but for agentic workflows.
*   **Security:** This is the elephant in the room. It involves a chain of trust for Skills, robust credential management for API access, and immutable audit trails for every action an agent takes. Without this, no CISO will sign off.
*   **Orchestration:** Real-world tasks require not one agent, but a team of them. Orchestration is the control plane that manages multi-agent coordination, chains complex workflows, and handles failure recovery and retries.
*   **Integration:** An agent that can't access enterprise systems of record is a toy. The real value is unlocked via pre-built, maintained connectors to Salesforce, SAP, Microsoft 365, and Google Workspace.

The market for this infrastructure is already materializing. The enterprise AI agent space is estimated at $5 billion in 2024, projected to more than double by 2026. Microsoft's Copilot is estimated at an ~$800 million annual revenue run-rate, according to CB Insights. And the bull-case projections are staggering: FutureSearch models OpenAI's agent-related revenue growing from roughly $0.5 billion in 2025 to $62.6 billion by 2027 — though their central estimate is significantly lower, reflecting the enormous uncertainty in this market.

**LLM APIs are commoditizing fast — a race to zero on price. The defensible margin isn't in the model. It's in the infrastructure that makes the model safe, reliable, and integrated.** That's the moat.

---

## VI. How This Maps to AgentPuter

This is where AgentPuter sits. We're not building a better agent — that's OpenClaw's job. We're building the infrastructure layer between the agent and the enterprise.

The stack we described in Posts #3 and #4 maps directly to the gaps above:

*   **Skills** are our solution for the marketplace and domain expertise layer. But critically, within AgentPuter, they are versioned, signed, and subjected to security scans, creating a trusted software supply chain for agent capabilities.
*   The **Agent Gateway** is the core of our infrastructure play. It acts as the central orchestration engine and security toll booth, managing permissions, enforcing access policies, and creating the audit trail for every agent action. It is the `systemd` or Kubernetes control plane for a fleet of agents.
*   **MCP (Master Control Program) Tools** are our standardized approach to the integration problem. By providing a stable, well-defined interface for connecting to systems like Salesforce or Google Workspace, we abstract away the complexity and maintenance burden from the agent itself.

The bet is straightforward: OpenClaw is the best open-source agent engine available. What it lacks is enterprise readiness — sandboxed execution, vendor-neutral orchestration across Claude and GPT and Llama, and persistent Skills that compound over time rather than resetting every session.

**OpenClaw is the engine. We're building the chassis, the safety system, and the road.**

---

## VII. Closing — Picks and Shovels

The agent gold rush is real. OpenClaw and the ClawHavoc aftermath proved both the demand and the risks. Thousands of developers are building agents. Very few are building the infrastructure to run them reliably.

That's where the durable margin lives. Three predictions for the next 12-18 months:

1.  **OpenClaw will remain free and open-source, and a "Red Hat for Agents" will emerge.** The core project's strength is its community. A commercial entity will soon offer enterprise-grade support, hardening, and indemnification for large-scale OpenClaw deployments, becoming the go-to partner for the Fortune 500.
2.  **ClawHub will introduce paid tiers following the next major security incident.** The current free-for-all model for Skills is untenable. After a high-profile breach originating from a malicious public Skill, expect the marketplace to roll out paid tiers for verified publishers, automated security scanning, and corporate accounts with private repositories.
3.  **The winning agent platform won't be the one with the best model—it will be the one with the best infrastructure.** The marginal difference in intelligence between GPT-5 and Claude 4 will be less important to an enterprise than reliability, security, auditability, and seamless integration with their existing tech stack.

The agent that automates your company's quarterly reporting won't win because it's 5% "smarter." It'll win because it runs every time, its actions are auditable for SOX compliance, and it has the right credentials to access your ERP.

**The Agent that does your quarterly report isn't smarter than ChatGPT. It just has better instructions, a reliable runtime, and the right tools plugged in.**

*Over these six posts, we've traced the arc of the AgentPuter project: from the core product vision, through the Brain-Body-Soul architecture, into the ecosystem of Skills and Gateways, and finally to the business models that make it sustainable. In our next post, we'll get our hands dirty and walk through a complete, end-to-end implementation: building a financial analysis agent from scratch using the AgentPuter stack.*