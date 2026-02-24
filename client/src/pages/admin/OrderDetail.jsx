import { useParams } from 'react-router-dom';

const AdminOrderDetail = () => {
  const { id } = useParams();

  return (
    <section className="card stack-sm">
      <h1>Admin - Order Detail</h1>
      <p>Order ID: {id}</p>
      <p className="muted">Timeline va status actions se them sau.</p>
    </section>
  );
};

export default AdminOrderDetail;
