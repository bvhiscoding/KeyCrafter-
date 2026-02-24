import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

const CartIcon = () => (
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
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShieldIcon = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SearchIcon = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const LogOutIcon = () => (
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
);

const Header = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className="site-header"
      role="banner"
      style={{ overflow: "visible" }}
    >
      <div className="container nav-wrap">
        {/* Brand */}
        <Link
          to="/"
          className="brand animate-neon-flicker"
          aria-label="KeyCrafter Home"
        >
          KEY
          <span
            style={{
              color: "#bf00ff",
              textShadow: "0 0 15px rgba(191,0,255,0.7)",
            }}
          >
            CRAFTER
          </span>
        </Link>

        {/* Nav Links */}
        <nav
          className="nav-links"
          aria-label="Main navigation"
          style={{ margin: "0 auto", gap: "2rem" }}
        >
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Products
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Support
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              style={{
                color: "#bf00ff",
                gap: "0.3rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShieldIcon /> Admin
            </NavLink>
          )}
        </nav>

        {/* Search Bar - Expand on focus */}
        <form
          onSubmit={handleSearch}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginRight: "1rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "12px",
              color: "var(--color-text-dim)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "99px",
              padding: "0.45rem 1rem 0.45rem 2.4rem",
              color: "#fff",
              fontSize: "0.85rem",
              outline: "none",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              width: "140px",
            }}
            onFocus={(e) => {
              e.target.style.width = "260px";
              e.target.style.background = "rgba(0,0,0,0.6)";
              e.target.style.borderColor = "var(--color-neon-cyan)";
              e.target.style.boxShadow = "0 0 15px rgba(0,245,255,0.2)";
              e.target.style.backdropFilter = "blur(10px)";
              e.target.placeholder = "Search for keyboards, switches...";
            }}
            onBlur={(e) => {
              e.target.style.width = "140px";
              e.target.style.background = "rgba(255,255,255,0.05)";
              e.target.style.borderColor = "rgba(0,245,255,0.15)";
              e.target.style.boxShadow = "none";
              e.target.style.backdropFilter = "none";
              e.target.placeholder = "Search...";
            }}
          />
        </form>

        {/* Nav Actions */}
        <div
          className="nav-actions"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Link
            to="/cart"
            className="button button-secondary"
            style={{
              padding: "0.45rem 0.85rem",
              gap: "0.4rem",
              display: "inline-flex",
              alignItems: "center",
            }}
            aria-label={`Cart, ${totalItems} items`}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                style={{
                  background: "var(--color-neon-cyan)",
                  color: "#000",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  padding: "0.05rem 0.4rem",
                  minWidth: "1.2rem",
                  textAlign: "center",
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div
              ref={dropdownRef}
              style={{ position: "relative" }}
            >
              <button
                className="button button-secondary"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ padding: "0.45rem 0.85rem", cursor: "pointer" }}
                aria-label="User Menu"
                aria-expanded={isDropdownOpen}
              >
                <UserIcon />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  onClick={() => setIsDropdownOpen(false)}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    width: "180px",
                    background: "rgba(13,13,40,0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 50,
                  }}
                  className="animate-fade-in"
                >
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    style={{
                      padding: "0.75rem 1rem",
                      color: "#fff",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "background 0.2s",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="dropdown-item"
                    style={{
                      padding: "0.75rem 1rem",
                      color: "#fff",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "background 0.2s",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="dropdown-item"
                    style={{
                      padding: "0.75rem 1rem",
                      color: "#fff",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "background 0.2s",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/login"
                    className="dropdown-item"
                    style={{
                      padding: "0.75rem 1rem",
                      color: "#ff4655",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "background 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <LogOutIcon /> Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="button button-primary">
              Login
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .dropdown-item:hover {
          background: rgba(0,245,255,0.1);
        }
      `}</style>
    </header>
  );
};

export default Header;
