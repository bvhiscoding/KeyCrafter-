import { Link } from 'react-router-dom';

const fakeOrders = [
  { id: 'KC001', date: '2026-02-20', total: 3290000, status: 'processing' },
  { id: 'KC002', date: '2026-02-10', total: 890000, status: 'delivered' },
];

const Orders = () => {
  return (
    <section className="stack-md">
      <h1>My Orders</h1>

      {fakeOrders.map((order) => (
        <article key={order.id} className="card order-row">
          <p>
            <strong>{order.id}</strong> - {order.status}
          </p>
          <p className="muted">{order.date}</p>
          <p>{order.total.toLocaleString('vi-VN')} VND</p>
          <Link to={`/orders/${order.id}`}>Detail</Link>
        </article>
      ))}
    </section>
  );
};

export default Orders;
