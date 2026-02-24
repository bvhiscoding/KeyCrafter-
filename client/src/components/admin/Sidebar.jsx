import { NavLink } from "react-router-dom";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: "⊞" },
  { to: "/admin/products", label: "Products", icon: "⌨" },
  { to: "/admin/categories", label: "Categories", icon: "◫" },
  { to: "/admin/brands", label: "Brands", icon: "◈" },
  { to: "/admin/orders", label: "Orders", icon: "◎" },
  { to: "/admin/users", label: "Users", icon: "◉" },
  { to: "/admin/reviews", label: "Reviews", icon: "◆" },
];

const Sidebar = () => {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "var(--color-neon-cyan)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "0.25rem 0",
          textShadow: "0 0 8px rgba(0,245,255,0.5)",
        }}
      >
        Admin Panel
      </div>
      <nav className="admin-nav" aria-label="Admin menu">
        {adminNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? " active" : ""}`
            }
          >
            <span
              aria-hidden="true"
              style={{ fontSize: "0.9rem", width: "18px", textAlign: "center" }}
            >
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
