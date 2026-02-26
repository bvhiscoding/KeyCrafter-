import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "@/components/product/ProductGrid";
import { useGetProductsQuery } from "@/features/products/productsApi";

/* ─── SVG ICONS ─── */
const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
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
const DownloadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
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

/* ─── KEYBOARD 3D ASCII ART COMPONENT ─── */
const KeyboardHero3D = () => {
  const keys = [
    [
      "ESC",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
    ],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "←"],
    ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ENTER"],
    ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHIFT"],
  ];

  const glowKeys = ["Q", "W", "E", "A", "S", "D", "SPACE"];
  const neonKeys = ["ESC", "F5", "F6"];

  return (
    <div
      className="keyboard-3d"
      aria-label="3D Keyboard illustration"
      role="img"
    >
      <div className="keyboard-body">
        {keys.map((row, ri) => (
          <div key={ri} className="key-row">
            {row.map((key, ki) => (
              <div
                key={ki}
                className={`key ${glowKeys.includes(key) ? "key-glow" : ""} ${neonKeys.includes(key) ? "key-neon" : ""} ${key === "ENTER" ? "key-wide" : ""} ${key === "SHIFT" ? "key-wider" : ""} ${key === "CAPS" ? "key-wide" : ""} ${key === "TAB" ? "key-wide" : ""} ${key === "←" ? "key-wide" : ""}`}
              >
                <span>{key}</span>
              </div>
            ))}
          </div>
        ))}
        <div className="key-row">
          <div className="key key-fn">
            <span>FN</span>
          </div>
          <div className="key key-ctrl">
            <span>CTRL</span>
          </div>
          <div className="key key-alt">
            <span>ALT</span>
          </div>
          <div className="key key-space key-glow">
            <span>SPACE</span>
          </div>
          <div className="key key-alt">
            <span>ALT</span>
          </div>
          <div className="key key-fn">
            <span>WIN</span>
          </div>
        </div>
      </div>
      <style>{`
        .keyboard-3d {
          perspective: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          /* No overflow:hidden here — that was clipping the keyboard edges */
          /* Instead, main has overflow-x:hidden to contain the page scroll */
        }
        .keyboard-body {
          background: linear-gradient(135deg, #1a1a3a 0%, #0d0d28 100%);
          border: 1px solid rgba(0,245,255,0.3);
          border-radius: 12px;
          padding: 14px 12px;
          display: grid;
          gap: 4px;
          /* zoom shrinks both the visual AND the layout box — no clipping */
          zoom: 1.04;
          transform: rotateX(15deg) rotateY(-5deg);
          box-shadow:
            0 40px 80px rgba(0,0,0,0.8),
            0 0 40px rgba(0,245,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.05);
          animation: float 4s ease-in-out infinite;
        }
        .key-row {
          display: flex;
          gap: 4px;
          justify-content: flex-start;
        }
        .key {
          min-width: 36px;
          height: 34px;
          padding: 0 4px;
          background: linear-gradient(145deg, #1e1e40 0%, #0a0a1e 100%);
          border: 1px solid rgba(0,245,255,0.12);
          border-bottom: 3px solid rgba(0,0,0,0.6);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.1s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .key span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          color: rgba(180,180,220,0.8);
          letter-spacing: 0.05em;
          user-select: none;
        }
        .key:hover {
          background: linear-gradient(145deg, #252545 0%, #131330 100%);
          transform: translateY(1px);
          border-bottom-width: 2px;
        }
        .key-glow {
          border-color: rgba(0,245,255,0.4);
          box-shadow: 0 0 12px rgba(0,245,255,0.3), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 8px rgba(0,245,255,0.1);
        }
        .key-glow span { color: #00f5ff; text-shadow: 0 0 6px rgba(0,245,255,0.8); }
        .key-neon {
          border-color: rgba(191,0,255,0.4);
          box-shadow: 0 0 12px rgba(191,0,255,0.3), 0 2px 4px rgba(0,0,0,0.5);
        }
        .key-neon span { color: #bf00ff; text-shadow: 0 0 6px rgba(191,0,255,0.8); }
        .key-wide { min-width: 60px; }
        .key-wider { min-width: 80px; }
        .key-fn, .key-ctrl, .key-alt { min-width: 46px; }
        .key-space { min-width: 220px; }
      `}</style>
    </div>
  );
};

/* ─── GAME SHOWCASE CAROUSEL ─── */
const games = [
  { name: "VALORANT", genre: "TACTICAL SHOOTER", color: "#ff4655", img: "VAL" },
  { name: "CS2", genre: "FPS", color: "#ff8c00", img: "CS2" },
  {
    name: "APEX LEGENDS",
    genre: "BATTLE ROYALE",
    color: "#cd3333",
    img: "APX",
  },
  { name: "STARCRAFT II", genre: "STRATEGY", color: "#0080ff", img: "STC" },
  { name: "DOTA 2", genre: "MOBA", color: "#c23b22", img: "DOT" },
  { name: "CYBERPUNK 2077", genre: "RPG", color: "#fcee09", img: "CP7" },
];

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
            {/* Game "logo" placeholder */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${game.color}33 0%, ${game.color}11 100%)`,
                border: `2px solid ${game.color}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: game.color,
                textShadow: `0 0 20px ${game.color}`,
                boxShadow: `0 0 30px ${game.color}33`,
                transition: "all 0.4s",
              }}
              aria-label={game.name}
            >
              {game.img}
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

/* ─── COMMUNITY SECTION ─── */
const testimonials = [
  {
    name: "NebulaStrike",
    role: "Pro Gamer",
    rating: 5,
    text: "The linear switches are incredibly smooth. My APM went up 15% after switching to KeyCrafter.",
    tag: "CS2 Player",
  },
  {
    name: "V0idCrafter",
    role: "Keyboard Enthusiast",
    rating: 5,
    text: "Finally a store that understands what builders need. The hot-swap boards are insane quality.",
    tag: "Builder",
  },
  {
    name: "CyberHex",
    role: "Content Creator",
    rating: 5,
    text: "My desk setup looks like a spaceship now. The RGB customization is on another level.",
    tag: "Streamer",
  },
  {
    name: "QuantumFps",
    role: "Speedrunner",
    rating: 5,
    text: "Sub-1ms response time is real. No more missed inputs in the heat of the moment.",
    tag: "Speedrunner",
  },
  {
    name: "AstralKeys",
    role: "Typist",
    rating: 5,
    text: "The tactile feedback is perfect. I love the thocking sound when I game at 3am.",
    tag: "Typing Enthusiast",
  },
  {
    name: "NightCodex",
    role: "Developer",
    rating: 5,
    text: "Coding sessions have never felt this good. The keycaps are crisp and the sound is perfect.",
    tag: "Dev",
  },
];

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
              "{t.text}"
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
        {[
          { value: "50K+", label: "Members", color: "var(--color-neon-cyan)" },
          {
            value: "4.9★",
            label: "Avg Rating",
            color: "var(--color-neon-yellow)",
          },
          { value: "200+", label: "Products", color: "#bf00ff" },
          {
            value: "99%",
            label: "Satisfied",
            color: "var(--color-neon-green)",
          },
        ].map((stat) => (
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

/* ─── DOWNLOAD / APP CTA ─── */
const DownloadCTA = () => (
  <section style={{ padding: "5rem 0" }} id="download">
    <div className="container">
      <div
        className="glass-card"
        style={{
          padding: "clamp(2rem, 5vw, 4rem)",
          background:
            "linear-gradient(135deg, rgba(0,245,255,0.05) 0%, rgba(191,0,255,0.08) 50%, rgba(0,245,255,0.03) 100%)",
          borderColor: "rgba(0,245,255,0.25)",
          boxShadow:
            "0 0 80px rgba(0,245,255,0.1), 0 0 40px rgba(191,0,255,0.1)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(191,0,255,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "-40px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            className="badge badge-cyan"
            style={{ marginBottom: "1.5rem", display: "inline-flex" }}
          >
            <DownloadIcon style={{ width: 14, height: 14 }} /> KeyCrafter App
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "1rem",
              textShadow: "0 0 30px rgba(0,245,255,0.3)",
            }}
          >
            Configure Your Build.
            <br />
            <span
              style={{
                color: "var(--color-neon-cyan)",
                textShadow: "0 0 25px rgba(0,245,255,0.7)",
              }}
            >
              Own The Meta.
            </span>
          </h2>
          <p
            style={{
              color: "var(--color-text-muted)",
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
          >
            Download the KeyCrafter companion app for real-time RGB control,
            macro programming, firmware updates, and community layout sharing.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <a
              href="#"
              className="button button-primary"
              style={{
                padding: "0.9rem 2rem",
                fontSize: "0.9rem",
                gap: "0.6rem",
              }}
              id="download-windows"
              aria-label="Download for Windows"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              Windows
            </a>
            <a
              href="#"
              className="button button-secondary"
              style={{
                padding: "0.9rem 2rem",
                fontSize: "0.9rem",
                gap: "0.6rem",
              }}
              id="download-mac"
              aria-label="Download for macOS"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              macOS
            </a>
            <a
              href="#"
              className="button button-secondary"
              style={{
                padding: "0.9rem 2rem",
                fontSize: "0.9rem",
                gap: "0.6rem",
              }}
              id="download-linux"
              aria-label="Download for Linux"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.263-.656.898-1.062.062-.475-.074-.172.25-.035.668.139.419.535.898.877.2.342-.698.7-1.18 1.09-1.13l.12.002c.427 0 .797.163 1.016.452.219.289.278.661.175 1.06l.026.002c.54.046 1.063.296 1.474.716.411.42.7.988.745 1.599-1.217.19-2.352 1.045-2.743 2.408-.255.877-.101 1.79.373 2.461.474.672 1.223 1.053 2.036 1.053.093 0 .186-.005.28-.015l.027-.003c1.074-.13 1.797-.808 2.12-1.616.24-.601.22-1.293-.046-1.872.272-.073.535-.176.787-.308l.093.006c.39.026.843.127 1.272.234l.154.039c.44.112.87.232 1.198.348l.127.044c.335.118.577.222.68.283-.01.098-.015.197-.015.296 0 .658.143 1.327.406 1.877.263.55.64.98 1.103 1.21.277.14.564.21.853.21.09 0 .18-.007.268-.02.978-.15 1.7-.97 1.893-2.058.064-.367.068-.771-.005-1.077.133.048.266.082.4.103l.044.005.04-.001c.58-.021 1.01-.412 1.247-.939.237-.527.27-1.218.108-1.866-.266-1.057-1.03-1.793-1.86-1.793-.184 0-.368.036-.549.112.078-.367.083-.8-.028-1.213-.22-.811-.842-1.332-1.47-1.332-.068 0-.138.008-.208.022-.54.117-1.005.627-1.19 1.344-.108.425-.09.858.033 1.167-.312-.154-.652-.232-.998-.232-.193 0-.387.026-.578.076-.32.085-.59.253-.813.475-.266-.5-.535-.96-.78-1.37C8.1 12.47 7.53 11.23 7.1 10.003c-.234-.655-.422-1.304-.49-1.947-.004-.036-.006-.072-.006-.108C6.604 4.94 8.68 2.98 11.66 2.982 11.66 2 11.66 0 12.504 0zm-.504 4c-.828 0-1.5.672-1.5 1.5S11.172 7 12 7s1.5-.672 1.5-1.5S12.828 4 12 4z" />
              </svg>
              Linux
            </a>
          </div>

          {/* Feature chips */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              "RGB Control",
              "Macro Config",
              "Firmware OTA",
              "Layout Sharing",
              "Cloud Sync",
            ].map((f) => (
              <span
                key={f}
                className="badge badge-cyan"
                style={{ fontSize: "0.72rem" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── FEATURES BAR ─── */
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
        {[
          {
            icon: <TruckIcon />,
            title: "Free Shipping",
            sub: "Orders over $99",
          },
          {
            icon: <ShieldIcon />,
            title: "2 Year Warranty",
            sub: "Full coverage",
          },
          {
            icon: <SupportIcon />,
            title: "24/7 Support",
            sub: "Always online",
          },
          { icon: <ZapIcon />, title: "Fast Dispatch", sub: "Ships same day" },
        ].map((f) => (
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

/* ─── MAIN HOME PAGE ─── */
const Home = () => {
  const { data: apiData, isLoading } = useGetProductsQuery({ limit: 6 });
  const raw = apiData?.data?.items ?? apiData?.data ?? apiData?.products;
  const products = Array.isArray(raw) ? raw.slice(0, 6) : [];

  return (
    <div style={{ paddingTop: 0 }}>
      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ padding: "4rem 0 3rem" }}>
        {/* Background glows */}
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
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                <span className="badge badge-cyan">
                  <ZapIcon style={{ width: 12, height: 12 }} /> Next-Gen
                  Platform
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
                The ultimate mechanical keyboard platform for gamers, builders,
                and typists. Browse premium switches, custom keycaps, and
                hot-swap boards engineered for the next level.
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
              <div
                style={{ display: "flex", gap: "2rem", paddingTop: "0.5rem" }}
              >
                {[
                  { n: "200+", l: "Products" },
                  { n: "50K+", l: "Builders" },
                  { n: "4.9★", l: "Rating" },
                ].map((s) => (
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

      {/* ═══ FEATURES BAR ═══ */}
      <FeaturesBar />

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section style={{ padding: "5rem 0" }} id="featured">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p
                className="badge badge-cyan"
                style={{ marginBottom: "0.75rem" }}
              >
                Hot Drops
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                Featured{" "}
                <span
                  style={{
                    color: "var(--color-neon-cyan)",
                    textShadow: "0 0 15px rgba(0,245,255,0.5)",
                  }}
                >
                  Products
                </span>
              </h2>
            </div>
            <Link
              to="/products"
              className="button button-secondary"
              id="view-all-products"
            >
              View All →
            </Link>
          </div>
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--color-text-muted)",
              }}
            >
              Loading products...
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      {/* ═══ GAME SHOWCASE ═══ */}
      <GameCarousel />

      {/* ═══ COMMUNITY ═══ */}
      <CommunitySection />

      {/* ═══ DOWNLOAD CTA ═══ */}
      <DownloadCTA />
    </div>
  );
};

export default Home;
