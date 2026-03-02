import { useState } from "react";

const KeyboardHero3D = () => {
  const [hoveredKey, setHoveredKey] = useState(null);

  const keys = [
    // Row 1
    [
      { l: "ESC", u: 1, glow: true }, { l: "1", u: 1, glow: true }, { l: "2", u: 1, glow: true }, { l: "3", u: 1, glow: true },
      { l: "4", u: 1, glow: true }, { l: "5", u: 1, glow: true }, { l: "6", u: 1, glow: true }, { l: "7", u: 1, glow: true },
      { l: "8", u: 1, glow: true }, { l: "9", u: 1, glow: true }, { l: "0", u: 1, glow: true }, { l: "-", u: 1, glow: true },
      { l: "=", u: 1, glow: true }, { l: "BACKSPACE", u: 2, glow: true }
    ],
    // Row 2
    [
      { l: "TAB", u: 1.5, glow: true }, { l: "Q", u: 1, neon: true }, { l: "W", u: 1, neon: true }, { l: "E", u: 1, neon: true },
      { l: "R", u: 1, neon: true }, { l: "T", u: 1, neon: true }, { l: "Y", u: 1, neon: true }, { l: "U", u: 1, neon: true },
      { l: "I", u: 1, neon: true }, { l: "O", u: 1, neon: true }, { l: "P", u: 1, neon: true }, { l: "[", u: 1, neon: true },
      { l: "]", u: 1, neon: true }, { l: "\\", u: 1.5, glow: true }
    ],
    // Row 3
    [
      { l: "CAPS", u: 1.75, glow: true }, { l: "A", u: 1, neon: true }, { l: "S", u: 1, neon: true }, { l: "D", u: 1, neon: true },
      { l: "F", u: 1, neon: true }, { l: "G", u: 1, neon: true }, { l: "H", u: 1, neon: true }, { l: "J", u: 1, neon: true },
      { l: "K", u: 1, neon: true }, { l: "L", u: 1, neon: true }, { l: ";", u: 1, neon: true }, { l: "'", u: 1, neon: true },
      { l: "ENTER", u: 2.25, glow: true }
    ],
    // Row 4
    [
      { l: "SHIFT", u: 2.25, glow: true }, { l: "Z", u: 1, neon: true }, { l: "X", u: 1, neon: true }, { l: "C", u: 1, neon: true },
      { l: "V", u: 1, neon: true }, { l: "B", u: 1, neon: true }, { l: "N", u: 1, neon: true }, { l: "M", u: 1, neon: true },
      { l: ",", u: 1, neon: true }, { l: ".", u: 1, neon: true }, { l: "/", u: 1, neon: true }, 
      { l: "SHIFT", u: 1.75, glow: true }, { l: "FN", u: 1, glow: true }
    ],
    // Row 5
    [
      { l: "CTRL", u: 1.5, glow: true }, { l: "WIN", u: 1, glow: true }, { l: "ALT", u: 1.5, glow: true },
      { l: "SPACE", u: 7, glow: true }, 
      { l: "ALT", u: 1.5, glow: true }, { l: "WIN", u: 1, glow: true }, { l: "CTRL", u: 1.5, glow: true }
    ]
  ];

  // Pre-calculate physical logical regions of keys for adjacency detection
  const keysWithMetrics = keys.map((row, r) => {
    let currentX = 0;
    return row.map((k, c) => {
      const startX = currentX;
      const endX = currentX + k.u;
      currentX = endX;
      return { ...k, r, c, startX, endX };
    });
  });

  const checkAdjacency = (key) => {
    if (!hoveredKey) return false;
    
    // Check vertical distance (at most 1 row away)
    const rowDiff = Math.abs(key.r - hoveredKey.r);
    if (rowDiff > 1) return false;

    if (rowDiff === 0) {
      // Same row: strictly adjacent (left, right, or self)
      return Math.abs(key.c - hoveredKey.c) <= 1;
    }

    // Adjacent row: check if their horizontal physical spans overlap or touch at corners
    // A small buffer of 0.1 handles any exact corner touch precision issues
    return key.startX <= hoveredKey.endX + 0.1 && key.endX >= hoveredKey.startX - 0.1;
  };

  return (
    <div
      className="keyboard-3d"
      aria-label="3D Keyboard illustration"
      role="img"
      onMouseLeave={() => setHoveredKey(null)}
    >
      <div className="keyboard-body">
        {keysWithMetrics.map((row, ri) => (
          <div key={ri} className="key-row">
            {row.map((key, ki) => {
              const isAdjacent = checkAdjacency(key);
              
              return (
                <div
                  key={ki}
                  onMouseEnter={() => setHoveredKey(key)}
                  className={[
                    "key",
                    isAdjacent ? "key-white" : (key.glow ? "key-glow" : ""),
                    !isAdjacent && key.neon ? "key-neon" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ width: `${36 * key.u + 4 * (key.u - 1)}px` }}
                >
                  <span>{key.l}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style>{`
        .keyboard-3d {
          perspective: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .keyboard-body {
          background: linear-gradient(135deg, #1a1a3a 0%, #0d0d28 100%);
          border: 1px solid rgba(0,245,255,0.3);
          border-radius: 12px;
          padding: 14px 12px;
          display: grid;
          gap: 4px;
          zoom: 1.04;
          transform: rotateX(15deg) rotateY(-5deg);
          box-shadow:
            0 40px 80px rgba(0,0,0,0.8),
            0 0 40px rgba(0,245,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.05);
          animation: float 4s ease-in-out infinite;
        }
        .key-row { display: flex; gap: 4px; justify-content: flex-start; }
        .key {
          height: 34px; padding: 0 4px;
          background: linear-gradient(145deg, #1e1e40 0%, #0a0a1e 100%);
          border: 1px solid rgba(0,245,255,0.12);
          border-bottom: 3px solid rgba(0,0,0,0.6);
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
          box-sizing: border-box;
        }
        .key span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem; font-weight: 700;
          color: rgba(180,180,220,0.8);
          letter-spacing: 0.05em; user-select: none;
          transition: color 0.2s;
        }
        .key:hover { 
          transform: translateY(1px); 
          border-bottom-width: 2px; 
        }
        .key-glow { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 12px rgba(0,245,255,0.3), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 8px rgba(0,245,255,0.1); }
        .key-glow span { color: #00f5ff; text-shadow: 0 0 6px rgba(0,245,255,0.8); }
        .key-neon { border-color: rgba(191,0,255,0.4); box-shadow: 0 0 12px rgba(191,0,255,0.3), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 8px rgba(191,0,255,0.1); }
        .key-neon span { color: #bf00ff; text-shadow: 0 0 6px rgba(191,0,255,0.8); }
        .key-white {
          background: linear-gradient(145deg, #2a2a4a 0%, #151535 100%);
          border-color: rgba(255, 255, 255, 0.7); 
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 12px rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        .key-white span { 
          color: #ffffff; 
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.9); 
        }
      `}</style>
    </div>
  );
};

export default KeyboardHero3D;
