import { Link } from 'react-router-dom';
import ProductGrid from '@/components/product/ProductGrid';
import { useGetWishlistQuery } from '@/features/user/userApi';

const Wishlist = () => {
  const { data: response, isLoading, error } = useGetWishlistQuery();

  if (isLoading) return <div className="container" style={{ padding: '2rem 0' }}>Loading wishlist...</div>;
  
  if (error) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p className="error">Please login to view your wishlist.</p>
        <Link to="/login" className="button button-primary">Login Now</Link>
      </div>
    );
  }

  const wishlistProducts = response?.data || [];

  return (
    <section className="stack-md container" style={{ padding: '2rem 0' }}>
      <h1>Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <p className="muted">Your wishlist is empty.</p>
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </section>
  );
};

export default Wishlist;
