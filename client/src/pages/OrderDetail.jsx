import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();

  return (
    <section className="card stack-sm">
      <h1>Order Detail - {id}</h1>
      <p className="muted">
        Timeline va chi tiet item se gan API theo sprint Cart & Checkout.
      </p>
      <ul>
        <li>Pending</li>
        <li>Processing</li>
        <li>Shipped</li>
        <li>Delivered</li>
      </ul>
    </section>
  );
};

export default OrderDetail;
