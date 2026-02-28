import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { useAppDispatch } from "@/app/hooks";
import { logout as logoutAction } from "@/store/auth.slice";
import { useLogoutMutation } from "@/features/auth/auth.api";
import { baseApi } from "@/lib/base.api";

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

const ProfileIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ListIcon = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const HeartIcon = () => (
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Header = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutApi().unwrap();
    } catch (error) {}
    dispatch(logoutAction());
    dispatch(baseApi.util.resetApiState());
    setIsDropdownOpen(false);
    navigate("/login");
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
          style={{ 
            margin: "0 auto", 
            gap: "2rem",
            display: "flex",
            opacity: isSearchFocused ? 0 : 1,
            pointerEvents: isSearchFocused ? "none" : "auto",
            transform: isSearchFocused ? "scale(0.95)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
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
          <NavLink
            to="/blog"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Blog
          </NavLink>
        </nav>

        {/* Search Bar - Expand on focus */}
        <div style={{ position: "relative", width: "140px", height: "36px", marginRight: "1rem" }}>
          <form
            onSubmit={handleSearch}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              zIndex: 10,
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
              placeholder={isSearchFocused ? "Search for keyboards, switches, keycaps..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{
                background: isSearchFocused ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.05)",
                border: "1px solid",
                borderColor: isSearchFocused ? "var(--color-neon-cyan)" : "rgba(0,245,255,0.15)",
                borderRadius: "99px",
                padding: "0.45rem 1rem 0.45rem 2.4rem",
                color: "#fff",
                fontSize: "0.85rem",
                outline: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                width: isSearchFocused ? "615px" : "140px",
                maxWidth: "calc(100vw - 300px)", // Prevents overflowing on smaller screens
                boxShadow: isSearchFocused ? "0 0 15px rgba(0,245,255,0.2)" : "none",
                backdropFilter: isSearchFocused ? "blur(10px)" : "none",
              }}
            />
          </form>
        </div>

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
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                className="button button-secondary"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  padding: "0.45rem 0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: isAdmin ? "#bf00ff" : "var(--color-neon-cyan)",
                  borderColor: isAdmin
                    ? "rgba(191,0,255,0.3)"
                    : "rgba(0,245,255,0.3)",
                }}
                aria-label="User Menu"
                aria-expanded={isDropdownOpen}
              >
                <UserIcon />
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                  }}
                >
                  {user?.name || "User"}
                </span>
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
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ProfileIcon /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#bf00ff",
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        transition: "background 0.2s",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <ShieldIcon /> Admin Panel
                    </Link>
                  )}
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
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ListIcon /> Orders
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
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <HeartIcon /> Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
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
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <LogOutIcon /> Logout
                  </button>
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
