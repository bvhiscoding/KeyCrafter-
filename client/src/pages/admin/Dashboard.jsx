import { useGetDashboardStatsQuery } from "@/features/admin/dashboardApi";
import { useGetAdminOrdersQuery } from "@/features/admin/adminApi";
import StatsCard from "@/components/admin/StatsCard";
import Loader from "@/components/common/Loader";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
  pending: "#ffcc00",
  processing: "#00f5ff",
  shipped: "#d966ff",
  delivered: "#39ff14",
  cancelled: "#ff5555",
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery(
    { limit: 6 },
  );
  const overview = stats?.data?.overview ?? stats?.overview ?? {};
  const s = overview;
  const recentOrders =
    ordersData?.data?.items ?? ordersData?.data ?? ordersData?.orders ?? [];

  return (
    <section style={{ display: "grid", gap: "2rem" }}>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.3rem",
          }}
        >
          Admin Dashboard
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
          KeyCrafter control center
        </p>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <Loader message="Fetching stats..." />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: "1rem",
          }}
        >
          <StatsCard
            title="Total Revenue"
            value={`${(s.totalRevenue || 0).toLocaleString("vi-VN")} ₫`}
            color="#00f5ff"
          />
          <StatsCard
            title="Total Orders"
            value={s.totalOrders ?? "-"}
            color="#d966ff"
          />
          <StatsCard
            title="Total Products"
            value={s.totalProducts ?? "-"}
            color="#ffcc00"
          />
          <StatsCard
            title="Total Users"
            value={s.totalUsers ?? "-"}
            color="#39ff14"
          />
        </div>
      )}

      {/* Recent Orders */}
      <div className="glass-card" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
            }}
          >
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            style={{
              color: "var(--color-neon-cyan)",
              fontSize: "0.78rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>

        {ordersLoading ? (
          <Loader message="Loading orders..." />
        ) : recentOrders.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
            No orders yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.83rem",
              }}
            >
              <thead>
                <tr>
                  {["Order ID", "Customer", "Status", "Total", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.5rem 0.75rem",
                          fontFamily: "var(--font-display)",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.09em",
                          color: "var(--color-text-muted)",
                          borderBottom: "1px solid rgba(0,245,255,0.1)",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td
                      style={{
                        padding: "0.65rem 0.75rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "#e8e8ff",
                      }}
                    >
                      #{(order._id || "").slice(-6).toUpperCase()}
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {order.user?.name || order.user?.email || "—"}
                    </td>
                    <td style={{ padding: "0.65rem 0.75rem" }}>
                      <span
                        style={{
                          padding: "0.15rem 0.55rem",
                          borderRadius: "99px",
                          fontSize: "0.68rem",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: STATUS_COLORS[order.status] || "#8888aa",
                          background: `${STATUS_COLORS[order.status] || "#8888aa"}18`,
                          border: `1px solid ${STATUS_COLORS[order.status] || "#8888aa"}44`,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 0.75rem",
                        fontFamily: "var(--font-display)",
                        color: "var(--color-neon-cyan)",
                        fontWeight: 700,
                      }}
                    >
                      {(order.total || order.totalAmount || 0).toLocaleString("vi-VN")} ₫
                    </td>
                    <td
                      style={{
                        padding: "0.65rem 0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "0.75rem",
        }}
      >
        {[
          {
            to: "/admin/products/new",
            label: "➕ New Product",
            color: "#00f5ff",
          },
          { to: "/admin/orders", label: "📦 All Orders", color: "#d966ff" },
          { to: "/admin/users", label: "👥 Manage Users", color: "#39ff14" },
          { to: "/admin/reviews", label: "⭐ Reviews", color: "#ffcc00" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(13,13,40,0.5)",
              border: `1px solid ${item.color}22`,
              borderRadius: "10px",
              color: item.color,
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              fontWeight: 700,
              textDecoration: "none",
              display: "block",
              textAlign: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${item.color}10`;
              e.currentTarget.style.boxShadow = `0 0 15px ${item.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(13,13,40,0.5)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
