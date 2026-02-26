import { Link, NavLink } from "react-router-dom";
import { adminNav } from "./adminNav";

const linkBase = {
  display: "flex",
  alignItems: "center",
  gap: "0.65rem",
  padding: "0.6rem 0.85rem",
  borderRadius: "8px",
  fontFamily: "var(--font-display)",
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
  textDecoration: "none",
  color: "var(--color-text-muted)",
  transition: "all 0.2s",
};

const linkActive = {
  color: "var(--color-neon-cyan)",
  background: "rgba(0,245,255,0.08)",
  textShadow: "0 0 8px rgba(0,245,255,0.4)",
};

/**
 * AdminSidebar — sidebar nav content (used in both desktop aside & mobile drawer)
 * @param {{ user?: object, onNavClick?: () => void, onLogout: () => void }} props
 */
const AdminSidebar = ({ user, onNavClick, onLogout }) => (
  <>
    {/* Brand */}
    <div
      style={{
        padding: "1.25rem 1rem 0.75rem",
        borderBottom: "1px solid rgba(0,245,255,0.1)",
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 900,
          color: "var(--color-neon-cyan)",
          textShadow: "0 0 12px rgba(0,245,255,0.6)",
          textDecoration: "none",
          display: "block",
          letterSpacing: "0.06em",
        }}
      >
        KEY
        <span
          style={{
            color: "#bf00ff",
            textShadow: "0 0 12px rgba(191,0,255,0.6)",
          }}
        >
          CRAFTER
        </span>
      </Link>
      <p
        style={{
          fontSize: "0.65rem",
          fontFamily: "var(--font-display)",
          color: "var(--color-text-dim)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginTop: "0.25rem",
        }}
      >
        Admin Panel
      </p>
    </div>

    {/* Navigation */}
    <nav
      style={{ padding: "0.85rem 0.75rem", display: "grid", gap: "0.25rem" }}
      aria-label="Admin menu"
    >
      {adminNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavClick}
          style={({ isActive }) => ({
            ...linkBase,
            ...(isActive ? linkActive : {}),
          })}
        >
          <span
            style={{
              width: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {item.icon}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>

    {/* User footer */}
    <div
      style={{
        marginTop: "auto",
        padding: "0.85rem 0.75rem",
        borderTop: "1px solid rgba(0,245,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.6rem 0.5rem",
          marginBottom: "0.4rem",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "rgba(0,245,255,0.1)",
            border: "1px solid rgba(0,245,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--color-neon-cyan)",
            fontSize: "0.8rem",
            flexShrink: 0,
          }}
        >
          {(user?.name || "A")[0].toUpperCase()}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#e8e8ff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name || "Admin"}
          </p>
          <p
            style={{
              fontSize: "0.65rem",
              color: "var(--color-text-dim)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.email}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        style={{
          ...linkBase,
          width: "100%",
          background: "rgba(255,50,50,0.05)",
          border: "1px solid rgba(255,50,50,0.12)",
          color: "#ff7070",
          justifyContent: "flex-start",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,50,50,0.12)";
          e.currentTarget.style.color = "#ff5555";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,50,50,0.05)";
          e.currentTarget.style.color = "#ff7070";
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>

      <Link
        to="/"
        style={{
          ...linkBase,
          marginTop: "0.2rem",
          justifyContent: "flex-start",
          color: "var(--color-text-dim)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--color-text-muted)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--color-text-dim)";
        }}
      >
        ← Back to Site
      </Link>
    </div>
  </>
);

export default AdminSidebar;
