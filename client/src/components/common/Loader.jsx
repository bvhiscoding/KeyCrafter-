const Loader = ({ message = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "3rem",
        minHeight: "200px",
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Neon spinner */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "3px solid rgba(0,245,255,0.15)",
          borderTopColor: "var(--color-neon-cyan)",
          animation: "spin 0.8s linear infinite",
          boxShadow: "0 0 15px rgba(0,245,255,0.3)",
        }}
        aria-hidden="true"
      />
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.78rem",
          color: "var(--color-text-muted)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {message}
      </p>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Loader;
