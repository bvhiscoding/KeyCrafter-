import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useCart from "@/hooks/useCart";
import { useGetProductDetailQuery } from "@/features/products/productsApi";
import { useGetOrdersQuery } from "@/features/orders/ordersApi";
import Loader from "@/components/common/Loader";
import ProductReviews from "@/components/reviews/ProductReviews";

const StarRatingDisplay = ({ value }) => {
  if (!value) return null;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={i <= Math.round(value) ? "#ffd700" : "none"}
        stroke="#ffd700"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>,
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
      {stars}
      <span
        style={{
          fontSize: "0.78rem",
          color: "#ffd700",
          fontWeight: 700,
          marginLeft: "4px",
        }}
      >
        {Number(value).toFixed(1)}
      </span>
    </span>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const currentUser = useSelector((s) => s.auth?.user);

  const { data: apiData, isLoading, isError } = useGetProductDetailQuery(slug);
  const product = apiData?.data || apiData;

  // Fetch user's orders to know if they can review (has delivered order with this product)
  const { data: ordersData } = useGetOrdersQuery(undefined, { skip: !currentUser });
  const orders = ordersData?.data?.items || ordersData?.data || ordersData?.items || ordersData?.orders || [];

  // Check if user has a delivered order containing this product
  const deliveredOrderId = (() => {
    if (!product?._id) return null;
    const match = orders.find(
      (o) =>
        o.status === "delivered" &&
        (o.items || []).some(
          (item) =>
            (item.product?._id ?? item.product) === product._id
        )
    );
    return match?._id || null;
  })();

  const canReview = !!deliveredOrderId;

  if (isLoading) {
    return <Loader message="Loading product..." />;
  }

  if (isError || !product) {
    return <Navigate to="/not-found" replace />;
  }

  const imageUrl =
    product.thumbnail || (product.images && product.images[0]) || product.image;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Product card */}
      <section className="product-detail card">
        {imageUrl && (
          <img src={imageUrl} alt={product.name} className="detail-image" />
        )}
        <div className="stack-md">
          <p className="badge">{product.brand?.name || product.brand}</p>
          <h1>{product.name}</h1>

          {/* Rating summary */}
          {product.avgRating > 0 && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <StarRatingDisplay value={product.avgRating} />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                ({product.reviewCount || 0}{" "}
                {product.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="muted">{product.shortDescription}</p>
          <p>
            Price: <strong>{product.price.toLocaleString("vi-VN")} VND</strong>
          </p>
          <p>
            Stock: <strong>{product.stock}</strong>
          </p>
          <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
            <button
              type="button"
              className="button button-primary"
              onClick={() => addItem(product)}
              style={{
                padding: "0.8rem 2rem",
                fontSize: "1rem",
                width: "100%",
              }}
            >
              <svg
                width="20"
                height="20"
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
              Add to cart
            </button>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <div
        className="glass-card"
        style={{ padding: "1.5rem 2rem", marginTop: "1.5rem" }}
      >
        <ProductReviews
          productId={product._id}
          orderId={deliveredOrderId}
          canReview={canReview}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
