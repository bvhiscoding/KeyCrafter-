import { Link } from "react-router-dom";

const ArrowIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CartSummary = ({ subtotal }) => {
  const shipping = subtotal > 990000 ? 0 : 50000;
  const total = subtotal + shipping;

  return (
    <aside
      className="summary-card glass-card"
      style={{ padding: "1.5rem" }}
      aria-label="Order summary"
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--color-neon-cyan)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "1.25rem",
        }}
      >
        Order Summary
      </h3>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "var(--color-text)",
            }}
          >
            {subtotal.toLocaleString("vi-VN")} VND
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}
          >
            Shipping
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.88rem",
              color:
                shipping === 0
                  ? "var(--color-neon-green)"
                  : "var(--color-text)",
            }}
          >
            {shipping === 0
              ? "FREE"
              : `${shipping.toLocaleString("vi-VN")} VND`}
          </span>
        </div>

        <div className="neon-divider" style={{ margin: "0.25rem 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "#fff",
              fontSize: "0.95rem",
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.2rem",
              color: "var(--color-neon-cyan)",
              textShadow: "0 0 10px rgba(0,245,255,0.5)",
            }}
          >
            {total.toLocaleString("vi-VN")} VND
          </span>
        </div>
      </div>

      {shipping > 0 && (
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            padding: "0.65rem 0.85rem",
            background: "rgba(57,255,20,0.06)",
            border: "1px solid rgba(57,255,20,0.15)",
            borderRadius: "8px",
            marginBottom: "1rem",
            lineHeight: 1.5,
          }}
        >
          Add {(990000 - subtotal).toLocaleString("vi-VN")} VND more for{" "}
          <strong style={{ color: "var(--color-neon-green)" }}>
            free shipping
          </strong>
          !
        </p>
      )}

      <Link
        to="/checkout"
        className="button button-primary button-block"
        style={{ padding: "0.9rem", gap: "0.5rem" }}
        aria-label="Proceed to checkout"
      >
        Checkout <ArrowIcon />
      </Link>
    </aside>
  );
};

export default CartSummary;
