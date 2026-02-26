import { Link } from "react-router-dom";
import ProductGrid from "@/components/product/ProductGrid";
import Loader from "@/components/common/Loader";
import { useGetWishlistQuery } from "@/features/user/userApi";
import useAuth from "@/hooks/useAuth";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const {
    data: response,
    isLoading,
    error,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div
        className="container"
        style={{ padding: "4rem 0", textAlign: "center" }}
      >
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Vui lòng đăng nhập để xem Wishlist của bạn.
        </p>
        <Link to="/login" className="button button-primary">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (isLoading) return <Loader message="Đang tải wishlist..." />;

  if (error) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p style={{ color: "var(--color-neon-red)" }}>
          Không thể tải wishlist.
        </p>
        <Link to="/login" className="button button-primary">
          Đăng nhập lại
        </Link>
      </div>
    );
  }

  // Backend returns ApiResponse: { success, data: [...products] }
  const wishlistProducts = Array.isArray(response?.data) ? response.data : [];

  return (
    <section className="stack-md container" style={{ padding: "2rem 0" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
          fontWeight: 900,
          color: "#fff",
        }}
      >
        ♥ Wishlist{" "}
        <span style={{ color: "var(--color-neon-cyan)", fontSize: "0.6em" }}>
          ({wishlistProducts.length} items)
        </span>
      </h1>
      {wishlistProducts.length === 0 ? (
        <div style={{ padding: "3rem 0", textAlign: "center" }}>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            Wishlist của bạn đang trống. Thêm sản phẩm bằng cách click nút ♥
            trên product card!
          </p>
          <Link to="/products" className="button button-primary">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </section>
  );
};

export default Wishlist;
