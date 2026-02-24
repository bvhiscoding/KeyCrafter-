import { Link } from "react-router-dom";

import useCart from "@/hooks/useCart";

const CartPlusIcon = () => (
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
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    <line x1="17" y1="9" x2="17" y2="15" />
    <line x1="14" y1="12" x2="20" y2="12" />
  </svg>
);

const EyeIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* Category tag color mapping */
const getCategoryBadgeStyle = (category) => {
  const map = {
    keyboard: {
      bg: "rgba(0,245,255,0.1)",
      color: "var(--color-neon-cyan)",
      border: "rgba(0,245,255,0.25)",
    },
    switch: {
      bg: "rgba(191,0,255,0.1)",
      color: "#d966ff",
      border: "rgba(191,0,255,0.25)",
    },
    keycap: {
      bg: "rgba(255,0,170,0.1)",
      color: "#ff55cc",
      border: "rgba(255,0,170,0.25)",
    },
    accessory: {
      bg: "rgba(57,255,20,0.08)",
      color: "#39ff14",
      border: "rgba(57,255,20,0.2)",
    },
  };
  const cat = category?.toLowerCase() || "";
  for (const [key, val] of Object.entries(map)) {
    if (cat.includes(key)) return val;
  }
  return {
    bg: "rgba(0,245,255,0.1)",
    color: "var(--color-neon-cyan)",
    border: "rgba(0,245,255,0.25)",
  };
};

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const badgeStyle = getCategoryBadgeStyle(product.category);

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Product Image Area */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "rgba(0,245,255,0.2)",
                letterSpacing: "0.2em",
                position: "relative",
                zIndex: 1,
              }}
            >
              {product.name?.slice(0, 2).toUpperCase() || "KC"}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
            opacity: 0,
            transition: "opacity 0.3s",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "1rem",
          }}
          className="product-overlay"
        />
      </div>

      {/* Content */}
      <div className="product-content">
        {/* Category badge */}
        <span
          style={{
            display: "inline-block",
            padding: "0.2rem 0.6rem",
            borderRadius: "999px",
            fontSize: "0.68rem",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: badgeStyle.bg,
            color: badgeStyle.color,
            border: `1px solid ${badgeStyle.border}`,
            width: "fit-content",
          }}
        >
          {product.category}
        </span>

        <div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
        </div>

        {product.shortDescription && (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.82rem",
              lineHeight: 1.55,
            }}
          >
            {product.shortDescription}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0.25rem",
          }}
        >
          <p
            className="product-price"
            aria-label={`Price: ${product.price?.toLocaleString("vi-VN")} VND`}
          >
            {product.price?.toLocaleString("vi-VN")}{" "}
            <span style={{ fontSize: "0.7rem", fontWeight: 600, opacity: 0.7 }}>
              VND
            </span>
          </p>
        </div>

        {/* Actions */}
        <div
          className="inline-actions"
          style={{ marginTop: "auto", paddingTop: "0.5rem" }}
        >
          <Link
            to={`/products/${product.slug}`}
            className="button button-secondary"
            style={{
              flex: 1,
              justifyContent: "center",
              padding: "0.55rem 0.75rem",
              fontSize: "0.78rem",
            }}
            aria-label={`View details for ${product.name}`}
          >
            <EyeIcon /> Detail
          </Link>
          <button
            type="button"
            className="button button-primary"
            style={{
              flex: 1,
              justifyContent: "center",
              padding: "0.55rem 0.75rem",
              fontSize: "0.78rem",
            }}
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <CartPlusIcon /> Add
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-overlay { opacity: 1 !important; }
      `}</style>
    </article>
  );
};

export default ProductCard;
