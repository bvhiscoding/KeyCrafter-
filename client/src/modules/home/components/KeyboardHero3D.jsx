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
                className={[
                  "key",
                  glowKeys.includes(key) ? "key-glow" : "",
                  neonKeys.includes(key) ? "key-neon" : "",
                  key === "ENTER" ? "key-wide" : "",
                  key === "SHIFT" ? "key-wider" : "",
                  key === "CAPS" ? "key-wide" : "",
                  key === "TAB" ? "key-wide" : "",
                  key === "←" ? "key-wide" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
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
          min-width: 36px; height: 34px; padding: 0 4px;
          background: linear-gradient(145deg, #1e1e40 0%, #0a0a1e 100%);
          border: 1px solid rgba(0,245,255,0.12);
          border-bottom: 3px solid rgba(0,0,0,0.6);
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.1s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .key span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem; font-weight: 700;
          color: rgba(180,180,220,0.8);
          letter-spacing: 0.05em; user-select: none;
        }
        .key:hover { background: linear-gradient(145deg, #252545 0%, #131330 100%); transform: translateY(1px); border-bottom-width: 2px; }
        .key-glow { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 12px rgba(0,245,255,0.3), 0 2px 4px rgba(0,0,0,0.5), inset 0 0 8px rgba(0,245,255,0.1); }
        .key-glow span { color: #00f5ff; text-shadow: 0 0 6px rgba(0,245,255,0.8); }
        .key-neon { border-color: rgba(191,0,255,0.4); box-shadow: 0 0 12px rgba(191,0,255,0.3), 0 2px 4px rgba(0,0,0,0.5); }
        .key-neon span { color: #bf00ff; text-shadow: 0 0 6px rgba(191,0,255,0.8); }
        .key-wide { min-width: 60px; }
        .key-wider { min-width: 80px; }
        .key-fn, .key-ctrl, .key-alt { min-width: 46px; }
        .key-space { min-width: 220px; }
      `}</style>
    </div>
  );
};

export default KeyboardHero3D;
