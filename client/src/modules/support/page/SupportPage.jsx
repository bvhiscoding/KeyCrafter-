import SupportTabs from "../components/SupportTabs";

const HelpIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const SupportPage = () => (
  <div style={{ paddingTop: 0 }}>
    {/* ═══ HERO ═══ */}
    <section
      className="hero"
      style={{ padding: "4rem 0 3rem", minHeight: "auto" }}
    >
      <div className="hero-bg-glow hero-bg-glow-1" aria-hidden="true" />
      <div
        className="container"
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <span
          className="badge badge-purple"
          style={{ marginBottom: "1rem", display: "inline-flex" }}
        >
          <HelpIcon /> Customer Support
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "1rem",
          }}
        >
          How Can We{" "}
          <span
            style={{
              color: "var(--color-neon-cyan)",
              textShadow: "0 0 20px rgba(0,245,255,0.6)",
            }}
          >
            Help You?
          </span>
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.05rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          From troubleshooting your new hot-swappable board to tracking your
          recent switch order, we've got you covered.
        </p>
      </div>
    </section>

    {/* ═══ CONTENT TABS ═══ */}
    <SupportTabs />
  </div>
);

export default SupportPage;
