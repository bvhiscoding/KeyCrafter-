import { downloadFeatures } from "../data/home.data";

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
            {downloadFeatures.map((f) => (
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

export default DownloadCTA;
