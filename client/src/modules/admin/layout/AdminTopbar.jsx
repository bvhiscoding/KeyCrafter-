/**
 * AdminTopbar — top header bar for admin panel
 * @param {{ onMenuToggle: () => void, sidebarOpen: boolean }} props
 */
const MenuIcon = () => (
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
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AdminTopbar = ({ onMenuToggle, sidebarOpen }) => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 30,
      height: "60px",
      background: "rgba(3,3,8,0.92)",
      borderBottom: "1px solid rgba(0,245,255,0.1)",
      backdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      padding: "0 1.5rem",
      gap: "1rem",
    }}
  >
    {/* Mobile menu toggle */}
    <button
      type="button"
      onClick={onMenuToggle}
      style={{
        background: "none",
        border: "none",
        color: "var(--color-text-muted)",
        cursor: "pointer",
        padding: "0.25rem",
        display: "none",
        lineHeight: 1,
      }}
      className="admin-mobile-toggle"
      aria-label="Toggle sidebar"
    >
      {sidebarOpen ? <XIcon /> : <MenuIcon />}
    </button>

    {/* Breadcrumb */}
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--color-text-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        KeyCrafter /{" "}
        <span style={{ color: "var(--color-neon-cyan)" }}>Admin</span>
      </p>
    </div>

    {/* Admin badge */}
    <span
      style={{
        padding: "0.3rem 0.75rem",
        background: "rgba(191,0,255,0.1)",
        border: "1px solid rgba(191,0,255,0.3)",
        borderRadius: "99px",
        color: "#d966ff",
        fontFamily: "var(--font-display)",
        fontSize: "0.68rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        boxShadow: "0 0 10px rgba(191,0,255,0.15)",
      }}
    >
      ⬡ Admin
    </span>
  </header>
);

export default AdminTopbar;
