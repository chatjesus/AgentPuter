export const metadata = {
  title: "Privacy Policy — TinyClaw",
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", padding: "60px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none" }}>← Back to home</a>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "24px 0 8px", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 40 }}>Last updated: February 9, 2026</p>

        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8, display: "grid", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>1. Information We Collect</h2>
            <p>When you use TinyClaw, we collect the following information:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li><strong>Account Information:</strong> Email address and name provided through Google Sign-In via Clerk authentication.</li>
              <li><strong>Payment Information:</strong> Payment details are processed securely by Stripe. We do not store your credit card information on our servers.</li>
              <li><strong>Usage Data:</strong> We collect anonymized data about how you interact with our service to improve the product.</li>
              <li><strong>Server Data:</strong> IP addresses and credentials for the cloud servers we provision on your behalf.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>2. How We Use Your Information</h2>
            <ul style={{ paddingLeft: 20 }}>
              <li>To create and manage your TinyClaw account and AI agent deployment.</li>
              <li>To process payments and manage subscriptions.</li>
              <li>To provision and manage cloud infrastructure on your behalf.</li>
              <li>To communicate with you about service updates and support.</li>
              <li>To improve our service and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>3. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              <li><strong>Clerk:</strong> Authentication and user management.</li>
              <li><strong>Stripe:</strong> Payment processing.</li>
              <li><strong>Hetzner Cloud:</strong> Cloud server infrastructure.</li>
              <li><strong>Anthropic / OpenAI / Google:</strong> AI model providers for your deployed agent.</li>
            </ul>
            <p style={{ marginTop: 8 }}>Each third-party service has its own privacy policy governing how they handle your data.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data, including encrypted connections (TLS/SSL), secure server infrastructure, and access controls. Server credentials are encrypted at rest.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>5. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. When you cancel your subscription, your cloud server is deleted immediately. Account data is retained for 30 days after cancellation, after which it is permanently deleted.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>6. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information at any time. You can manage your account through the dashboard or contact us at <a href="mailto:oscarzamora199907@gmail.com" style={{ color: "#a78bfa" }}>oscarzamora199907@gmail.com</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:oscarzamora199907@gmail.com" style={{ color: "#a78bfa" }}>oscarzamora199907@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
