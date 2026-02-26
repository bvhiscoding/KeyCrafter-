import { useState, useEffect } from "react";
import { games } from "../data/home.data";

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

const GameCarousel = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % games.length),
      3500,
    );
    return () => clearInterval(id);
  }, [paused]);

  const game = games[active];

  return (
    <section style={{ padding: "5rem 0" }} id="games">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="badge badge-purple" style={{ marginBottom: "1rem" }}>
            <ZapIcon /> Game Showcase
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
            Engineered For{" "}
            <span
              style={{
                color: "var(--color-neon-cyan)",
                textShadow: "0 0 20px rgba(0,245,255,0.6)",
              }}
            >
              Every Arena
            </span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            From tactical shooters to strategy games — KeyCrafter keyboards are
            tuned for competitive play.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            alignItems: "center",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left: game preview */}
          <div
            className="glass-card scanlines"
            style={{
              padding: "2.5rem",
              textAlign: "center",
              minHeight: "340px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              borderColor: game.color + "44",
              boxShadow: `0 0 40px ${game.color}22`,
              transition: "all 0.4s",
            }}
          >
            {/* Game Logo */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                background: `radial-gradient(circle, ${game.color}33 0%, transparent 80%)`,
                border: `2px solid ${game.color}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 30px ${game.color}33`,
                transition: "all 0.4s",
                overflow: "hidden"
              }}
              aria-label={game.name}
            >
              <img 
                src={game.img} 
                alt={game.name} 
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease-in-out" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "0.05em",
                  textShadow: `0 0 15px ${game.color}88`,
                }}
              >
                {game.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.72rem",
                  color: game.color,
                  letterSpacing: "0.2em",
                  marginTop: "0.3rem",
                  textShadow: `0 0 8px ${game.color}`,
                }}
              >
                {game.genre}
              </div>
            </div>
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.88rem",
                maxWidth: "280px",
              }}
            >
              Optimized response times and tactile feedback for maximum
              performance.
            </p>
          </div>

          {/* Right: game selector */}
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {games.map((g, i) => (
              <button
                key={g.name}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Select ${g.name}`}
                style={{
                  background:
                    i === active
                      ? `rgba(${g.color
                          .slice(1)
                          .match(/../g)
                          .map((h) => parseInt(h, 16))
                          .join(",")}, 0.12)`
                      : "rgba(13,13,40,0.5)",
                  border: `1px solid ${i === active ? g.color + "66" : "rgba(0,245,255,0.1)"}`,
                  borderRadius: "10px",
                  padding: "0.85rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  boxShadow: i === active ? `0 0 20px ${g.color}22` : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background:
                        i === active ? g.color : "rgba(255,255,255,0.15)",
                      boxShadow: i === active ? `0 0 8px ${g.color}` : "none",
                      transition: "all 0.25s",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: i === active ? "#fff" : "var(--color-text-muted)",
                      letterSpacing: "0.05em",
                      transition: "color 0.25s",
                    }}
                  >
                    {g.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.65rem",
                    color: i === active ? g.color : "var(--color-text-dim)",
                    letterSpacing: "0.12em",
                    transition: "all 0.25s",
                  }}
                >
                  {g.genre}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "2rem",
          }}
          role="tablist"
          aria-label="Game carousel indicators"
        >
          {games.map((g, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to ${g.name}`}
              role="tab"
              aria-selected={i === active}
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  i === active
                    ? "var(--color-neon-cyan)"
                    : "rgba(0,245,255,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow:
                  i === active ? "0 0 10px var(--color-neon-cyan)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameCarousel;
