import { useParams, Link } from "react-router-dom";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/features/admin/adminApi";
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

const AdminOrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetAdminOrderByIdQuery(id);
  const [updateStatus, { isLoading: updating }] =
    useUpdateOrderStatusMutation();
  const order = data?.data || data?.order;

  if (isLoading) return <Loader message="Loading order..." />;
  if (!order) return <p style={{ color: "#ff5555" }}>Order not found.</p>;

  const allowedOptions = [
    order.status,
    ...(OrderStatusTransitions[order.status] || []),
  ];

  const handleStatus = async (e) => {
    try {
      await updateStatus({ id, status: e.target.value }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Update failed");
    }
  };

  return (
    <section style={{ display: "grid", gap: "1.5rem", maxWidth: "820px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.2rem",
            }}
          >
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <select
            value={order.status}
            onChange={handleStatus}
            disabled={updating || allowedOptions.length <= 1}
            style={{
              background: "rgba(13,13,40,0.9)",
              border: `1px solid ${STATUS_COLORS[order.status] || "#8888aa"}55`,
              borderRadius: "8px",
              padding: "0.5rem 0.75rem",
              color: STATUS_COLORS[order.status] || "#8888aa",
              fontFamily: "var(--font-display)",
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              cursor: allowedOptions.length <= 1 ? "not-allowed" : "pointer",
              outline: "none",
              opacity: allowedOptions.length <= 1 ? 0.7 : 1,
            }}
          >
            {STATUS_OPTIONS.filter((s) => allowedOptions.includes(s)).map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ),
            )}
          </select>
          <Link
            to="/admin/orders"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.82rem",
              fontFamily: "var(--font-display)",
              textDecoration: "none",
            }}
          >
            ← All Orders
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* Items */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            Items ({order.items?.length})
          </h3>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.65rem",
                  background: "rgba(0,245,255,0.03)",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,245,255,0.07)",
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: "44px",
                      height: "44px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "#e8e8ff",
                      fontSize: "0.83rem",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.73rem",
                    }}
                  >
                    × {item.quantity}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-neon-cyan)",
                    whiteSpace: "nowrap",
                    fontSize: "0.85rem",
                  }}
                >
                  {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Side info */}
        <div style={{ display: "grid", gap: "0.85rem", minWidth: "210px" }}>
          {/* Customer */}
          <div className="glass-card" style={{ padding: "1.1rem" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.6rem",
              }}
            >
              Customer
            </p>
            <p
              style={{ color: "#e8e8ff", fontSize: "0.85rem", fontWeight: 600 }}
            >
              {order.user?.name || "—"}
            </p>
            <p
              style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}
            >
              {order.user?.email}
            </p>
          </div>

          {/* Summary */}
          <div className="glass-card" style={{ padding: "1.1rem" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              Summary
            </p>
            {[
              {
                l: "Subtotal",
                v: `${(order.subtotal || 0).toLocaleString("vi-VN")} ₫`,
              },
              {
                l: "Shipping",
                v:
                  order.shippingFee === 0
                    ? "FREE"
                    : `${(order.shippingFee || 0).toLocaleString("vi-VN")} ₫`,
              },
              {
                l: "Total",
                v: `${(order.total || 0).toLocaleString("vi-VN")} ₫`,
                bold: true,
              },
            ].map((r) => (
              <div
                key={r.l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  marginBottom: "0.4rem",
                }}
              >
                <span
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.79rem",
                  }}
                >
                  {r.l}
                </span>
                <span
                  style={{
                    fontFamily: r.bold ? "var(--font-display)" : "inherit",
                    fontWeight: r.bold ? 900 : 600,
                    color: r.bold
                      ? "var(--color-neon-cyan)"
                      : "var(--color-text)",
                    fontSize: "0.82rem",
                  }}
                >
                  {r.v}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="glass-card" style={{ padding: "1.1rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.6rem",
                }}
              >
                Ship To
              </p>
              <p
                style={{
                  color: "var(--color-text)",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "#fff" }}>
                  {order.shippingAddress.name}
                </strong>{" "}
                - {order.shippingAddress.phone}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
                {order.shippingAddress.city}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminOrderDetail;
