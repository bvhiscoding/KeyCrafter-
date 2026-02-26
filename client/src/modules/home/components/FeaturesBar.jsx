const TruckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const SupportIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ZapIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const features = [
  { icon: <TruckIcon />, title: "Free Shipping", sub: "Orders over $99" },
  { icon: <ShieldIcon />, title: "2 Year Warranty", sub: "Full coverage" },
  { icon: <SupportIcon />, title: "24/7 Support", sub: "Always online" },
  { icon: <ZapIcon />, title: "Fast Dispatch", sub: "Ships same day" },
];

const FeaturesBar = () => (
  <div
    style={{
      background: "rgba(13,13,40,0.5)",
      borderTop: "1px solid rgba(0,245,255,0.1)",
      borderBottom: "1px solid rgba(0,245,255,0.1)",
      padding: "1.5rem 0",
    }}
  >
    <div className="container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
          >
            <div style={{ color: "var(--color-neon-cyan)", flexShrink: 0 }}>
              {f.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.05em",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {f.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FeaturesBar;
