import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "1.5rem",
      }}
    >
      {/* 404 glitch effect */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem, 20vw, 12rem)",
          fontWeight: 900,
          lineHeight: 1,
          color: "transparent",
          backgroundImage:
            "linear-gradient(135deg, rgba(0,245,255,0.8), rgba(191,0,255,0.8))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          textShadow: "none",
          filter: "drop-shadow(0 0 30px rgba(0,245,255,0.4))",
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        404
      </div>

      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.75rem",
          }}
        >
          Signal Lost
        </h1>
        <p className="muted" style={{ maxWidth: "380px", lineHeight: 1.7 }}>
          The page you're looking for has drifted into the void. Check the URL
          or head back to base.
        </p>
      </div>

      <Link
        to="/"
        className="button button-primary"
        style={{ padding: "0.85rem 2rem" }}
      >
        ← Return to Base
      </Link>
    </section>
  );
};

export default NotFound;
