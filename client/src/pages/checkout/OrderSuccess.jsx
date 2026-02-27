import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <section className="card stack-md">
      <h1>Order Success</h1>
      <p className="muted">
        Cam on ban da dat hang. Team KeyCrafter se lien he xac nhan som.
      </p>
      <Link to="/orders" className="button">
        View my orders
      </Link>
    </section>
  );
};

export default OrderSuccess;
