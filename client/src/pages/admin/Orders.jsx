import { useState } from "react";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/features/admin/admin.api";
import { Link } from "react-router-dom";
import Loader from "@/components/common/Loader";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const STATUS_COLORS = {
  pending: "#ffcc00",
  confirmed: "#ffa500",
  processing: "#00f5ff",
  shipped: "#d966ff",
  delivered: "#39ff14",
  cancelled: "#ff5555",
};

const OrderStatusTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const ArrowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const StatusSelect = ({ orderId, current }) => {
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [val, setVal] = useState(current);

  const allowedOptions = [current, ...(OrderStatusTransitions[current] || [])];

  const handleChange = async (e) => {
    const status = e.target.value;
    setVal(status);
    try {
      await updateStatus({ id: orderId, status }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Update failed");
      setVal(current);
    }
  };

  return (
    <select
      value={val}
      onChange={handleChange}
      disabled={isLoading || allowedOptions.length <= 1}
      style={{
        background: "rgba(13,13,40,0.9)",
        border: `1px solid ${STATUS_COLORS[val] || "#8888aa"}44`,
        borderRadius: "6px",
        padding: "0.25rem 0.5rem",
        color: STATUS_COLORS[val] || "#8888aa",
        fontSize: "0.72rem",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        cursor: allowedOptions.length <= 1 ? "not-allowed" : "pointer",
        outline: "none",
        opacity: allowedOptions.length <= 1 ? 0.7 : 1,
      }}
    >
      {STATUS_OPTIONS.filter((s) => allowedOptions.includes(s)).map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
};

const AdminOrders = () => {
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useGetAdminOrdersQuery(
    filter ? { status: filter } : {},
  );
  const orders = data?.data?.items ?? data?.data ?? data?.orders ?? [];

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.25rem",
          }}
        >
          Orders
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {["", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            style={{
              padding: "0.35rem 0.85rem",
              borderRadius: "99px",
              border: `1px solid ${s && filter === s ? STATUS_COLORS[s] : "rgba(0,245,255,0.15)"}`,
              background:
                s && filter === s ? `${STATUS_COLORS[s]}14` : "transparent",
              color:
                s && filter === s
                  ? STATUS_COLORS[s]
                  : filter === s
                    ? "var(--color-neon-cyan)"
                    : "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <Loader message="Loading orders..." />
        ) : orders.length === 0 ? (
          <p
            style={{
              padding: "2rem",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            No orders found.
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
                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                  {[
                    "Order",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: "var(--color-text-muted)",
                        borderBottom: "1px solid rgba(0,245,255,0.1)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(0,245,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "#e8e8ff",
                      }}
                    >
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "var(--color-text-muted)",
                        maxWidth: "140px",
                      }}
                    >
                      <p style={{ color: "#e8e8ff", fontSize: "0.82rem" }}>
                        {order.user?.name || "—"}
                      </p>
                      <p
                        style={{
                          color: "var(--color-text-dim)",
                          fontSize: "0.72rem",
                        }}
                      >
                        {order.user?.email}
                      </p>
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "var(--color-text-muted)",
                        textAlign: "center",
                      }}
                    >
                      {order.items?.length || 0}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        fontFamily: "var(--font-display)",
                        color: "var(--color-neon-cyan)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {(order.total || 0).toLocaleString("vi-VN")} ₫
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <StatusSelect
                        orderId={order._id}
                        current={order.status}
                      />
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "var(--color-text-muted)",
                        whiteSpace: "nowrap",
                        fontSize: "0.78rem",
                      }}
                    >
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <Link
                        to={`/admin/orders/${order._id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.3rem 0.6rem",
                          background: "rgba(0,245,255,0.08)",
                          border: "1px solid rgba(0,245,255,0.2)",
                          color: "var(--color-neon-cyan)",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        View <ArrowIcon />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminOrders;
