import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import useAuth from "@/hooks/useAuth";
import { logout as logoutAction } from "@/store/auth.slice";
import { useLogoutMutation } from "@/features/auth/auth.api";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const SIDEBAR_W = 240;

const AdminLayout = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (_) {}
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--color-void)",
      }}
    >
      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          width: `${SIDEBAR_W}px`,
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          background: "rgba(8,8,24,0.97)",
          borderRight: "1px solid rgba(0,245,255,0.12)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        aria-label="Admin sidebar"
      >
        <AdminSidebar
          user={user}
          onNavClick={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 39,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        style={{
          width: `${SIDEBAR_W}px`,
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          background: "rgba(8,8,24,0.99)",
          borderRight: "1px solid rgba(0,245,255,0.15)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
        aria-label="Admin sidebar mobile"
      >
        <AdminSidebar
          user={user}
          onNavClick={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Main area ── */}
      <div
        style={{
          flex: 1,
          marginLeft: `${SIDEBAR_W}px`,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
        className="admin-main-area"
      >
        <AdminTopbar
          onMenuToggle={() => setSidebarOpen((s) => !s)}
          sidebarOpen={sidebarOpen}
        />
        <main style={{ flex: 1, padding: "2rem 2rem 3rem", minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-main-area { margin-left: 0 !important; }
          aside[aria-label="Admin sidebar"] { display: none !important; }
          .admin-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
