const EmptyState = ({ title, description, icon }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        display: "grid",
        gap: "1rem",
        placeItems: "center",
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Default icon or custom icon */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "14px",
          background: "rgba(0,245,255,0.08)",
          border: "1px solid rgba(0,245,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          color: "rgba(0,245,255,0.4)",
        }}
        aria-hidden="true"
      >
        {icon || (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>
      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: "0.4rem",
          }}
        >
          {title}
        </h3>
        <p
          className="muted"
          style={{ fontSize: "0.88rem", maxWidth: "320px", margin: "0 auto" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
