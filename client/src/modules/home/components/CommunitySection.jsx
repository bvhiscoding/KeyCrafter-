import { testimonials, communityStats } from "../data/home.data";

const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UsersIcon = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CommunitySection = () => (
  <section
    style={{ padding: "5rem 0", overflow: "hidden", width: "100%" }}
    id="community"
  >
    <div className="container" style={{ marginBottom: "3rem" }}>
      <div style={{ textAlign: "center" }}>
        <p className="badge badge-cyan" style={{ marginBottom: "1rem" }}>
          <UsersIcon style={{ width: 14, height: 14 }} /> Community
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.75rem",
          }}
        >
          Trusted By{" "}
          <span
            style={{
              color: "#bf00ff",
              textShadow: "0 0 20px rgba(191,0,255,0.6)",
            }}
          >
            50K+ Players
          </span>
        </h2>
        <p
          style={{
            color: "var(--color-text-muted)",
            maxWidth: "450px",
            margin: "0 auto",
          }}
        >
          Join a thriving community of keyboard enthusiasts, gamers, and
          builders.
        </p>
      </div>
    </div>

    {/* Auto-scrolling testimonials */}
    <div style={{ overflow: "hidden", padding: "0.5rem 0", width: "100%" }}>
      <div className="carousel-track" aria-label="Community testimonials">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              minWidth: "300px",
              maxWidth: "300px",
              padding: "1.5rem",
              display: "grid",
              gap: "0.75rem",
            }}
            aria-hidden={i >= testimonials.length}
          >
            <div
              style={{ display: "flex", gap: "2px" }}
              aria-label={`${t.rating} stars`}
            >
              {Array.from({ length: t.rating }).map((_, si) => (
                <span key={si} style={{ color: "var(--color-neon-yellow)" }}>
                  <StarIcon />
                </span>
              ))}
            </div>
            <p
              style={{
                color: "var(--color-text)",
                fontSize: "0.88rem",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              &ldquo;{t.text}&rdquo;
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0.25rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--color-neon-cyan)",
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {t.role}
                </div>
              </div>
              <span
                className="badge badge-purple"
                style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem" }}
              >
                {t.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Stats row */}
    <div className="container" style={{ marginTop: "3rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
        }}
      >
        {communityStats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 900,
                color: stat.color,
                textShadow: `0 0 15px ${stat.color}88`,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.8rem",
                marginTop: "0.4rem",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CommunitySection;
