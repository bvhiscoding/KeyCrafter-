import { Link, useNavigate } from "react-router-dom";

import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/features/user/userApi";

/* ── Icons ─────────────────────────────────────────────────── */
const HeartIcon = ({ filled }) => (
  <svg
    width="17" height="17" viewBox="0 0 24 24"
    fill={filled ? "#ff4da6" : "none"}
    stroke={filled ? "#ff4da6" : "rgba(255,255,255,0.85)"}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
    style={{ filter: filled ? "drop-shadow(0 0 6px rgba(255,77,166,0.8))" : "none", transition: "all 0.2s" }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    <line x1="17" y1="9" x2="17" y2="15" /><line x1="14" y1="12" x2="20" y2="12" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

/* ── Category badge colors ──────────────────────────────────── */
const getCategoryBadgeStyle = (category) => {
  const map = {
    keyboard:  { bg: "rgba(0,245,255,0.1)",   color: "var(--color-neon-cyan)", border: "rgba(0,245,255,0.25)" },
    switch:    { bg: "rgba(191,0,255,0.1)",   color: "#d966ff",                border: "rgba(191,0,255,0.25)" },
    keycap:    { bg: "rgba(255,0,170,0.1)",   color: "#ff55cc",                border: "rgba(255,0,170,0.25)" },
    accessory: { bg: "rgba(57,255,20,0.08)",  color: "#39ff14",                border: "rgba(57,255,20,0.2)"  },
  };
  const cat = category?.toLowerCase() || "";
  for (const [key, val] of Object.entries(map)) {
    if (cat.includes(key)) return val;
  }
  return { bg: "rgba(0,245,255,0.1)", color: "var(--color-neon-cyan)", border: "rgba(0,245,255,0.25)" };
};

/* ══ ProductCard ══════════════════════════════════════════════ */
const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Wishlist queries — only fire when logged in
  const { data: wlData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToWishlist,    { isLoading: adding   }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();

  const productId   = product._id || product.id;
  // Support both populated objects ({ name: 'Keyboard' }) and plain strings
  const categoryName = product.category?.name || product.category || '';
  const brandName    = product.brand?.name || product.brand || '';
  const imageUrl     = product.thumbnail || product.image || null;
  const badgeStyle   = getCategoryBadgeStyle(categoryName);

  // Check if this product is in the user's wishlist
  const wishlistItems = wlData?.data ?? wlData ?? [];
  const inWishlist = Array.isArray(wishlistItems)
    ? wishlistItems.some((item) => {
        const itemId = item._id || item.id || item;
        return String(itemId) === String(productId);
      })
    : false;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    try {
      if (inWishlist) await removeFromWishlist(productId).unwrap();
      else            await addToWishlist(productId).unwrap();
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  return (
    <article className="product-card" aria-label={product.name}>

      {/* ── Image area ─────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>

        {/* Heart button — top right */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={adding || removing}
          aria-label={inWishlist ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
          title={inWishlist ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
          style={{
            position:       "absolute",
            top:            "10px",
            right:          "10px",
            zIndex:         10,
            width:          "34px",
            height:         "34px",
            borderRadius:   "50%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            cursor:         "pointer",
            backdropFilter: "blur(8px)",
            background:     inWishlist ? "rgba(255,77,166,0.15)" : "rgba(5,5,20,0.65)",
            border:         inWishlist ? "1px solid rgba(255,77,166,0.5)" : "1px solid rgba(255,255,255,0.12)",
            boxShadow:      inWishlist ? "0 0 12px rgba(255,77,166,0.35)" : "none",
            transition:     "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background   = "rgba(255,77,166,0.2)";
            e.currentTarget.style.border       = "1px solid rgba(255,77,166,0.6)";
            e.currentTarget.style.transform    = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background   = inWishlist ? "rgba(255,77,166,0.15)" : "rgba(5,5,20,0.65)";
            e.currentTarget.style.border       = inWishlist ? "1px solid rgba(255,77,166,0.5)" : "1px solid rgba(255,255,255,0.12)";
            e.currentTarget.style.transform    = "scale(1)";
          }}
        >
          <HeartIcon filled={inWishlist} />
        </button>

        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="product-image" loading="lazy" />
        ) : (
          <div className="product-image-placeholder">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "rgba(0,245,255,0.2)", letterSpacing: "0.2em", position: "relative", zIndex: 1 }}>
              {product.name?.slice(0, 2).toUpperCase() || "KC"}
            </div>
          </div>
        )}

        {/* Hover gradient overlay */}
        <div
          style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.3s", pointerEvents: "none" }}
          className="product-overlay"
        />
      </div>

      {/* ── Card content ───────────────────────────────────── */}
      <div className="product-content">

        {/* Category badge */}
        <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.68rem", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}`, width: "fit-content" }}>
          {categoryName}
        </span>

        <div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{brandName}</p>
        </div>

        {product.shortDescription && (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem", lineHeight: 1.55 }}>
            {product.shortDescription}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.25rem" }}>
          <p className="product-price" aria-label={`Price: ${product.price?.toLocaleString("vi-VN")} VND`}>
            {product.price?.toLocaleString("vi-VN")}{" "}
            <span style={{ fontSize: "0.7rem", fontWeight: 600, opacity: 0.7 }}>VND</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="inline-actions" style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
          <Link
            to={`/products/${product.slug}`}
            className="button button-secondary"
            style={{ flex: 1, justifyContent: "center", padding: "0.55rem 0.75rem", fontSize: "0.78rem" }}
            aria-label={`View details for ${product.name}`}
          >
            <EyeIcon /> Detail
          </Link>
          <button
            type="button"
            className="button button-primary"
            style={{ flex: 1, justifyContent: "center", padding: "0.55rem 0.75rem", fontSize: "0.78rem" }}
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <CartPlusIcon /> Add
          </button>
        </div>
      </div>

      <style>{`.product-card:hover .product-overlay { opacity: 1 !important; }`}</style>
    </article>
  );
};

export default ProductCard;
