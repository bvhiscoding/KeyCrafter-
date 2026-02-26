import { Navigate, useParams } from "react-router-dom";

import useCart from "@/hooks/useCart";
import { useGetProductDetailQuery } from "@/features/products/productsApi";
import Loader from "@/components/common/Loader";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();

  const { data: apiData, isLoading, isError } = useGetProductDetailQuery(slug);
  const product = apiData?.data || apiData;

  if (isLoading) {
    return <Loader message="Loading product..." />;
  }

  if (isError || !product) {
    return <Navigate to="/not-found" replace />;
  }

  // Support both image and thumbnail property
  const imageUrl =
    product.thumbnail || (product.images && product.images[0]) || product.image;

  return (
    <section className="product-detail card">
      {imageUrl && (
        <img src={imageUrl} alt={product.name} className="detail-image" />
      )}
      <div className="stack-md">
        <p className="badge">{product.brand?.name || product.brand}</p>
        <h1>{product.name}</h1>
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
            style={{ padding: "0.8rem 2rem", fontSize: "1rem", width: "100%" }}
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
  );
};

export default ProductDetail;
