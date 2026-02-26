import { Link, useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "@/features/orders/ordersApi";
import Loader from "@/components/common/Loader";

/* ── Status config ──────────────────────────────────────────── */
const STEPS = ["pending", "processing", "shipped", "delivered"];
const STATUS_META = {
  pending: { color: "#ffcc00", glow: "rgba(255,200,0,0.3)", label: "Pending" },
  processing: {
    color: "#00f5ff",
    glow: "rgba(0,245,255,0.3)",
    label: "Processing",
  },
  shipped: { color: "#d966ff", glow: "rgba(191,0,255,0.3)", label: "Shipped" },
  delivered: {
    color: "#39ff14",
    glow: "rgba(57,255,20,0.3)",
    label: "Delivered",
  },
  cancelled: {
    color: "#ff5555",
    glow: "rgba(255,50,50,0.3)",
    label: "Cancelled",
  },
};

/* ── Icons ─────────────────────────────────────────────────── */
const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const CheckCircle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const CircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(id);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  const order = data?.data || data?.order;

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to cancel order.");
    }
  };

  if (isLoading) return <Loader message="Loading order details..." />;
  if (error || !order)
    return (
      <div>
        <Link
          to="/orders"
          className="button button-secondary"
          style={{
            marginBottom: "1.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
          }}
        >
          <BackIcon /> Back to Orders
        </Link>
        <p style={{ color: "#ff5555" }}>Order not found or failed to load.</p>
      </div>
    );

  const meta = STATUS_META[order.status] || STATUS_META.pending;
  const currentStep = STEPS.indexOf(order.status);

  return (
    <section style={{ maxWidth: "780px" }}>
      {/* Back link */}
      <Link
        to="/orders"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "var(--color-text-muted)",
          fontSize: "0.82rem",
          textDecoration: "none",
          marginBottom: "1.5rem",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--color-neon-cyan)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--color-text-muted)")
        }
      >
        <BackIcon /> Back to Orders
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.3rem",
            }}
          >
            Order #{(order._id || id || "").slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.3rem 1rem",
              borderRadius: "99px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: `rgba(${meta.color === "#ffcc00" ? "255,200,0" : meta.color === "#00f5ff" ? "0,245,255" : meta.color === "#d966ff" ? "191,0,255" : meta.color === "#39ff14" ? "57,255,20" : "255,50,50"},0.12)`,
              color: meta.color,
              border: `1px solid ${meta.glow.replace("0.3", "0.4")}`,
            }}
          >
            {meta.label}
          </span>
          {order.status === "pending" && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                padding: "0.4rem 0.85rem",
                background: "rgba(255,50,50,0.12)",
                border: "1px solid rgba(255,50,50,0.25)",
                color: "#ff5555",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      {order.status !== "cancelled" && (
        <div
          className="glass-card"
          style={{ padding: "1.5rem", marginBottom: "1.25rem" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "1.25rem",
            }}
          >
            Order Progress
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "0",
              position: "relative",
            }}
          >
            {/* Track line */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "12.5%",
                right: "12.5%",
                height: "2px",
                background: "rgba(0,245,255,0.1)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "12.5%",
                width: `${(currentStep / (STEPS.length - 1)) * 75}%`,
                height: "2px",
                background: "rgba(0,245,255,0.6)",
                zIndex: 1,
                transition: "width 0.5s ease",
              }}
            />

            {STEPS.map((step, i) => {
              const done = currentStep >= i;
              const active = currentStep === i;
              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: done
                        ? "rgba(0,245,255,0.2)"
                        : "rgba(13,13,40,0.9)",
                      border: `2px solid ${done ? "rgba(0,245,255,0.7)" : "rgba(0,245,255,0.15)"}`,
                      color: done
                        ? "var(--color-neon-cyan)"
                        : "rgba(0,245,255,0.2)",
                      boxShadow: active
                        ? "0 0 12px rgba(0,245,255,0.5)"
                        : "none",
                    }}
                  >
                    {done ? <CheckCircle /> : <CircleIcon />}
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: done
                        ? "var(--color-neon-cyan)"
                        : "var(--color-text-dim)",
                      textAlign: "center",
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            Order Items ({order.items?.length || 0})
          </h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {(order.items || []).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.75rem",
                  background: "rgba(0,245,255,0.03)",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,245,255,0.08)",
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "52px",
                      height: "52px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid rgba(0,245,255,0.15)",
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "#e8e8ff",
                      fontSize: "0.88rem",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {item.name || item.product?.name}
                  </p>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Qty: {item.quantity}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-neon-cyan)",
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ minWidth: "200px" }}>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}
            >
              Summary
            </h3>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {[
                {
                  label: "Subtotal",
                  val: (order.subtotal || 0).toLocaleString("vi-VN") + " VND",
                },
                {
                  label: "Shipping",
                  val:
                    order.shippingFee === 0
                      ? "FREE"
                      : (order.shippingFee || 0).toLocaleString("vi-VN") +
                        " VND",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "0.82rem",
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{
                      color: "var(--color-text)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    {r.val}
                  </span>
                </div>
              ))}
              <div className="neon-divider" style={{ margin: "0.3rem 0" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.9rem",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    color: "var(--color-neon-cyan)",
                    fontSize: "1.05rem",
                    textShadow: "0 0 8px rgba(0,245,255,0.4)",
                  }}
                >
                  {(order.totalAmount || order.total || 0).toLocaleString(
                    "vi-VN",
                  )}{" "}
                  VND
                </span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div
              className="glass-card"
              style={{ padding: "1.25rem", marginTop: "0.85rem" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.75rem",
                }}
              >
                Ship To
              </h3>
              <p
                style={{
                  color: "var(--color-text)",
                  fontSize: "0.82rem",
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

export default OrderDetail;
