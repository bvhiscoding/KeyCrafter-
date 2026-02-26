import {
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
  useGetTopProductsQuery,
} from "@/features/admin/dashboardApi";
import StatsCard from "@/components/admin/StatsCard";
import Loader from "@/components/common/Loader";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  pending: "#ffcc00",
  processing: "#00f5ff",
  shipped: "#d966ff",
  delivered: "#39ff14",
  cancelled: "#ff5555",
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: revenueChart, isLoading: revenueLoading } =
    useGetRevenueChartQuery();
  const { data: topProducts, isLoading: topProductsLoading } =
    useGetTopProductsQuery();

  const overview = stats?.data?.overview ?? stats?.overview ?? {};
  const s = overview;
  const recentOrders = stats?.data?.recentOrders ?? stats?.recentOrders ?? [];
  const chartData = revenueChart?.data ?? [];
  const topProductsList = topProducts?.data ?? [];

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

      {/* Charts and Top Products */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Revenue Chart */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            Revenue Chart (30 Days)
          </h2>
          {revenueLoading ? (
            <Loader message="Loading chart..." />
          ) : chartData.length === 0 ? (
            <p
              style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}
            >
              No data available.
            </p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#222"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#888"
                    fontSize="0.75rem"
                    tickFormatter={(tick) => {
                      const d = new Date(tick);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize="0.75rem"
                    tickFormatter={(tick) => `${(tick / 1000000).toFixed(1)}M`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      background: "#0d0d28",
                      border: "1px solid #00f5ff33",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#00f5ff", fontWeight: 700 }}
                    formatter={(value) => [
                      `${value.toLocaleString("vi-VN")} ₫`,
                      "Revenue",
                    ]}
                    labelStyle={{ color: "#888", marginBottom: "0.5rem" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00f5ff"
                    fillOpacity={1}
                    fill="url(#colorRevs)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            Top Products
          </h2>
          {topProductsLoading ? (
            <Loader message="Loading products..." />
          ) : topProductsList.length === 0 ? (
            <p
              style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}
            >
              No products found.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                maxHeight: "300px",
              }}
            >
              {topProductsList.map((product) => (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginRight: "0.5rem",
                  }}
                >
                  <img
                    src={product.thumbnail?.url || "/placeholder-image.png"}
                    alt={product.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#e8e8ff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        margin: "0.2rem 0 0",
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Sold:{" "}
                      <span style={{ color: "#00f5ff", fontWeight: 700 }}>
                        {product.soldCount}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        color: "var(--color-neon-cyan)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {(product.salePrice ?? product.price ?? 0).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      ₫
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

        {statsLoading ? (
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
                      {(order.total || order.totalAmount || 0).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      ₫
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
