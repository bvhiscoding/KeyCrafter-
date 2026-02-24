import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/common/EmptyState";
import useCart from "@/hooks/useCart";

const ShoppingBagIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Cart = () => {
  const { items, subtotal, changeQuantity, removeItem } = useCart();

  if (!items.length) {
    return (
      <div style={{ paddingTop: "1rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "1.5rem",
          }}
        >
          Your <span style={{ color: "var(--color-neon-cyan)" }}>Cart</span>
        </h1>
        <EmptyState
          title="Your cart is empty"
          description="Add some products from the Products page to get started."
          icon={<ShoppingBagIcon />}
        />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "1rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          fontWeight: 900,
          color: "#fff",
          marginBottom: "1.5rem",
        }}
      >
        Your{" "}
        <span
          style={{
            color: "var(--color-neon-cyan)",
            textShadow: "0 0 15px rgba(0,245,255,0.5)",
          }}
        >
          Cart
        </span>
        <span
          style={{
            fontSize: "1rem",
            color: "var(--color-text-muted)",
            marginLeft: "0.75rem",
            fontWeight: 400,
          }}
        >
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <section className="cart-layout" aria-label="Shopping cart">
        <div className="stack-sm">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onChangeQuantity={changeQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} />
      </section>
    </div>
  );
};

export default Cart;
