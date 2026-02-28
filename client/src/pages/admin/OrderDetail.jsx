import { useParams, Link } from "react-router-dom";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/features/admin/admin.api";
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

/* ── Icons ── */
const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

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
    <section style={{ maxWidth: "1000px", width: "100%", margin: "0 auto" }}>
      {/* Back to Orders */}
      <Link
        to="/admin/orders"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "none",
          border: "none",
          textDecoration: "none",
          color: "var(--color-text-muted)",
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          fontSize: "0.82rem",
          marginBottom: "1.5rem",
          padding: 0,
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-neon-cyan)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
      >
        <BackIcon /> Back to All Orders
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            ORDER #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: STATUS_COLORS[order.status] || "#8888aa" }}></span>
            Placed on {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "—"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--color-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>Update Status</span>
            <select
              value={order.status}
              onChange={handleStatus}
              disabled={updating || allowedOptions.length <= 1}
              style={{
                background: `rgba(${parseInt(STATUS_COLORS[order.status].slice(1, 3), 16)}, ${parseInt(STATUS_COLORS[order.status].slice(3, 5), 16)}, ${parseInt(STATUS_COLORS[order.status].slice(5, 7), 16)}, 0.1)`,
                border: `1px solid ${STATUS_COLORS[order.status] || "#8888aa"}55`,
                borderRadius: "8px",
                padding: "0.6rem 1rem",
                color: STATUS_COLORS[order.status] || "#8888aa",
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                cursor: allowedOptions.length <= 1 ? "not-allowed" : "pointer",
                outline: "none",
                opacity: allowedOptions.length <= 1 ? 0.7 : 1,
                boxShadow: `0 0 15px rgba(${parseInt(STATUS_COLORS[order.status].slice(1, 3), 16)}, ${parseInt(STATUS_COLORS[order.status].slice(3, 5), 16)}, ${parseInt(STATUS_COLORS[order.status].slice(5, 7), 16)}, 0.15)`
              }}
            >
              {STATUS_OPTIONS.filter((s) => allowedOptions.includes(s)).map(
                (s) => (
                  <option key={s} value={s} style={{ background: "var(--color-void)", color: "#fff" }}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Left Column: Items */}
        <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              <PackageIcon /> Order Items ({order.items?.length})
            </h3>
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {(order.items || []).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "1rem",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "10px",
                    border: "1px solid rgba(0,245,255,0.08)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)";
                    e.currentTarget.style.background = "rgba(0,245,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,245,255,0.08)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.2)";
                  }}
                >
                  <div style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    background: "rgba(0,245,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "1px solid rgba(0,245,255,0.15)"
                  }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        color: "#fff",
                        fontSize: "0.9rem",
                        marginBottom: "0.2rem"
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        color: "var(--color-neon-cyan)",
                        fontSize: "0.75rem",
                        fontWeight: 500
                      }}
                    >
                      {item.price.toLocaleString("vi-VN")} ₫ <span style={{ color: "var(--color-text-dim)", marginLeft: "4px" }}>× {item.quantity}</span>
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#fff",
                      whiteSpace: "nowrap",
                      fontSize: "0.95rem",
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Side Info */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Summary */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid rgba(0,245,255,0.1)",
                paddingBottom: "1rem"
              }}
            >
              <ReceiptIcon /> Order Summary
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                <span>Subtotal</span>
                <span>{(order.subtotal || 0).toLocaleString("vi-VN")} ₫</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "FREE" : `${(order.shippingFee || 0).toLocaleString("vi-VN")} ₫`}</span>
              </div>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              paddingTop: "1rem", 
              borderTop: "1px dashed rgba(0,245,255,0.2)",
              marginTop: "0.5rem"
            }}>
              <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-display)", fontWeight: 600 }}>Total</span>
              <span style={{ 
                fontFamily: "var(--font-display)", 
                fontWeight: 900, 
                color: "var(--color-neon-cyan)", 
                fontSize: "1.35rem",
                textShadow: "0 0 15px rgba(0,245,255,0.3)"
              }}>
                {(order.total || 0).toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center"
              }}
            >
              <UserIcon /> Customer
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                background: "rgba(0,245,255,0.1)", 
                border: "1px solid rgba(0,245,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-neon-cyan)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.1rem"
              }}>
                {(order.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.1rem" }}>
                  {order.user?.name || "—"}
                </p>
                <p style={{ color: "var(--color-text-dim)", fontSize: "0.8rem" }}>
                  {order.user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <MapPinIcon /> Shipping Address
              </p>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "1rem", border: "1px solid rgba(0,245,255,0.05)" }}>
                <p style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  {order.shippingAddress.name}
                </p>
                <p style={{ color: "var(--color-neon-cyan)", fontSize: "0.82rem", marginBottom: "0.8rem", letterSpacing: "0.02em" }}>
                  {order.shippingAddress.phone}
                </p>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.ward}, {order.shippingAddress.district}<br />
                  {order.shippingAddress.city}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminOrderDetail;
