const MinusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const CartItem = ({ item, onChangeQuantity, onRemove }) => {
  return (
    <article className="cart-item" aria-label={item.name}>
      {/* Image */}
      {item.image ? (
        <img src={item.image} alt={item.name} className="cart-image" />
      ) : (
        <div
          className="cart-image"
          style={{
            background: "linear-gradient(135deg, #0d0d28, #1a1a3a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            color: "rgba(0,245,255,0.3)",
            fontWeight: 900,
          }}
        >
          {item.name?.slice(0, 2).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div style={{ display: "grid", gap: "0.3rem", alignContent: "start" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "var(--color-text)",
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.85rem",
            fontWeight: 900,
            color: "var(--color-neon-cyan)",
          }}
        >
          {item.price?.toLocaleString("vi-VN")} VND
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
          Total: {(item.price * item.quantity).toLocaleString("vi-VN")} VND
        </p>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div className="inline-actions" style={{ gap: "0.4rem" }}>
          <button
            type="button"
            className="button button-secondary"
            style={{ padding: "0.35rem 0.6rem", minWidth: "32px" }}
            onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <MinusIcon />
          </button>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#fff",
              minWidth: "24px",
              textAlign: "center",
            }}
            aria-live="polite"
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            className="button button-secondary"
            style={{ padding: "0.35rem 0.6rem", minWidth: "32px" }}
            onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <PlusIcon />
          </button>
        </div>
        <button
          type="button"
          className="button button-danger"
          style={{
            padding: "0.35rem 0.6rem",
            width: "100%",
            fontSize: "0.75rem",
            gap: "0.3rem",
          }}
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from cart`}
        >
          <TrashIcon /> Remove
        </button>
      </div>
    </article>
  );
};

export default CartItem;
