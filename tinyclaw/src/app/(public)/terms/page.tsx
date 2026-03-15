export const metadata = {
  title: "Terms of Service — TinyClaw",
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", padding: "60px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none" }}>← Back to home</a>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "24px 0 8px", letterSpacing: "-0.02em" }}>Terms of Service</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 40 }}>Last updated: February 9, 2026</p>

        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8, display: "grid", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>1. Service Description</h2>
            <p>TinyClaw provides a one-click deployment service for OpenClaw AI agents. We provision and manage cloud infrastructure, configure AI model access, and connect your agent to messaging channels on your behalf.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>2. Account & Eligibility</h2>
            <p>You must be at least 18 years old to use TinyClaw. You are responsible for maintaining the security of your account credentials and for all activities under your account.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>3. Subscription & Payment</h2>
            <ul style={{ paddingLeft: 20 }}>
              <li>TinyClaw offers a 7-day free trial, then operates on a monthly subscription at $29.99/month.</li>
              <li>Payment is processed securely through Stripe.</li>
              <li>Your subscription renews automatically each month until canceled.</li>
              <li>You may cancel your subscription at any time through the dashboard.</li>
              <li>Upon cancellation, your service continues until the end of the current billing period, after which your cloud server is terminated.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>4. Acceptable Use</h2>
            <p>You agree not to use TinyClaw to:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>Violate any applicable laws or regulations.</li>
              <li>Send spam, phishing, or malicious content through your AI agent.</li>
              <li>Attempt to access other users&apos; servers or data.</li>
              <li>Overload or interfere with our infrastructure.</li>
              <li>Use the service for any illegal or harmful purpose.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>5. Service Availability</h2>
            <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance or updates that temporarily affect availability. We are not liable for losses resulting from service interruptions.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>6. AI Model Usage</h2>
            <p>Your AI agent uses third-party AI models (Anthropic Claude, OpenAI GPT, Google Gemini). Usage is subject to each provider&apos;s terms of service and acceptable use policies. AI-generated content may not always be accurate.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>7. Limitation of Liability</h2>
            <p>TinyClaw is provided &quot;as is&quot; without warranties of any kind. Our total liability is limited to the amount you paid in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>8. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time by canceling your subscription and contacting support.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>9. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:oscarzamora199907@gmail.com" style={{ color: "#a78bfa" }}>oscarzamora199907@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
