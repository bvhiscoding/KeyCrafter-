import { Link } from "react-router-dom";
import { heroStats } from "../data/home.data";
import KeyboardHero3D from "./KeyboardHero3D";

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

const HeroSection = () => (
  <section className="hero" style={{ padding: "4rem 0 3rem" }}>
    <div className="hero-bg-glow hero-bg-glow-1" aria-hidden="true" />
    <div className="hero-bg-glow hero-bg-glow-2" aria-hidden="true" />

    <div className="container" style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        {/* Left content */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span className="badge badge-cyan">
              <ZapIcon style={{ width: 12, height: 12 }} /> Next-Gen Platform
            </span>
            <span className="badge badge-purple">Gaming Grade</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#fff",
            }}
          >
            Build Your{" "}
            <span
              className="text-glow-cyan"
              style={{ color: "var(--color-neon-cyan)", display: "block" }}
            >
              Dream Keyboard
            </span>
            <span
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.6em",
                fontWeight: 400,
              }}
            >
              Setup.
            </span>
          </h1>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "480px",
            }}
          >
            The ultimate mechanical keyboard platform for gamers, builders, and
            typists. Browse premium switches, custom keycaps, and hot-swap
            boards engineered for the next level.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              to="/products"
              className="button button-primary"
              style={{ padding: "0.85rem 2rem", fontSize: "0.9rem" }}
              id="hero-cta-shop"
            >
              <ZapIcon /> Shop Now
            </Link>
            <a
              href="#games"
              className="button button-secondary"
              style={{ padding: "0.85rem 2rem", fontSize: "0.9rem" }}
              id="hero-cta-discover"
            >
              Discover More
            </a>
          </div>

          {/* Mini stats */}
          <div style={{ display: "flex", gap: "2rem", paddingTop: "0.5rem" }}>
            {heroStats.map((s) => (
              <div key={s.l}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    color: "var(--color-neon-cyan)",
                    textShadow: "0 0 12px rgba(0,245,255,0.5)",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D Keyboard */}
        <div
          className="animate-float"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <KeyboardHero3D />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
