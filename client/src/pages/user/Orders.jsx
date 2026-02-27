import { Link } from 'react-router-dom';
import { useGetOrdersQuery, useCancelOrderMutation } from '@/features/orders/ordersApi';
import Loader from '@/components/common/Loader';

/* ── Icons ─────────────────────────────────────────────────── */
const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ── Status Badge ───────────────────────────────────────────── */
const STATUS = {
  pending:    { label:'Pending',    bg:'rgba(255,200,0,0.12)',   color:'#ffcc00',  border:'rgba(255,200,0,0.3)' },
  confirmed:  { label:'Confirmed',  bg:'rgba(0,245,255,0.08)',   color:'#00f5ff',  border:'rgba(0,245,255,0.2)' },
  processing: { label:'Processing', bg:'rgba(0,245,255,0.1)',    color:'#00f5ff',  border:'rgba(0,245,255,0.3)' },
  shipped:    { label:'Shipped',    bg:'rgba(191,0,255,0.1)',    color:'#d966ff',  border:'rgba(191,0,255,0.3)' },
  delivered:  { label:'Delivered',  bg:'rgba(57,255,20,0.08)',   color:'#39ff14',  border:'rgba(57,255,20,0.2)' },
  cancelled:  { label:'Cancelled',  bg:'rgba(255,50,50,0.1)',    color:'#ff5555',  border:'rgba(255,50,50,0.25)' },
};
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{ display:'inline-block', padding:'0.2rem 0.7rem', borderRadius:'99px', fontSize:'0.7rem', fontFamily:'var(--font-display)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
};

/* ══ Page ════════════════════════════════════════════════════ */
const Orders = () => {
  const { data, isLoading, error } = useGetOrdersQuery();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  // Backend returns: { success, data: { items: [...], pagination: {...} } }
  const orders = data?.data?.items ?? data?.data ?? data?.items ?? data?.orders ?? [];

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try { await cancelOrder(id).unwrap(); }
    catch (err) { alert(err?.data?.message || 'Cannot cancel this order.'); }
  };

  if (isLoading) return <Loader message="Loading orders..." />;

  if (error) return (
    <section>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:900, color:'#fff', marginBottom:'0.5rem' }}>My Orders</h1>
      <p style={{ color:'#ff5555' }}>Failed to load orders. Please try again.</p>
    </section>
  );

  return (
    <section>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:900, color:'#fff', marginBottom:'0.3rem' }}>My Orders</h1>
        <p style={{ color:'var(--color-text-muted)', fontSize:'0.88rem' }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card" style={{ padding:'3rem 2rem', textAlign:'center' }}>
          <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'rgba(0,245,255,0.08)', border:'1px solid rgba(0,245,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', color:'rgba(0,245,255,0.4)' }}>
            <BoxIcon />
          </div>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#e8e8ff', fontSize:'1.1rem', marginBottom:'0.5rem' }}>No orders yet</h3>
          <p style={{ color:'var(--color-text-muted)', fontSize:'0.88rem', marginBottom:'1.5rem' }}>Start by browsing our keyboard collection</p>
          <Link to="/products" className="button button-primary" style={{ display:'inline-flex', padding:'0.7rem 1.5rem' }}>Shop Now →</Link>
        </div>
      ) : (
        <div style={{ display:'grid', gap:'1rem' }}>
          {orders.map((order) => (
            <article key={order._id || order.id} className="glass-card" style={{ padding:'1.25rem 1.5rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
                {/* Left */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem' }}>
                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9rem', color:'#fff' }}>
                      #{(order._id || order.id || '').slice(-8).toUpperCase()}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p style={{ color:'var(--color-text-muted)', fontSize:'0.78rem' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN', { year:'numeric', month:'long', day:'numeric' }) : 'N/A'}
                  </p>
                  <p style={{ color:'var(--color-text-muted)', fontSize:'0.78rem', marginTop:'0.2rem' }}>
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Right */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem' }}>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'1.1rem', color:'var(--color-neon-cyan)', textShadow:'0 0 10px rgba(0,245,255,0.4)' }}>
                    {(order.total || order.totalAmount || 0).toLocaleString('vi-VN')} VND
                  </p>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order._id || order.id)}
                        disabled={cancelling}
                        style={{ padding:'0.35rem 0.75rem', background:'rgba(255,50,50,0.12)', border:'1px solid rgba(255,50,50,0.25)', color:'#ff5555', borderRadius:'7px', cursor:'pointer', fontSize:'0.75rem', fontFamily:'var(--font-display)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}
                      >
                        Cancel
                      </button>
                    )}
                    <Link
                      to={`/orders/${order._id || order.id}`}
                      className="button button-secondary"
                      style={{ padding:'0.35rem 0.85rem', fontSize:'0.78rem', display:'inline-flex', alignItems:'center', gap:'0.3rem' }}
                    >
                      Details <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Items preview */}
              {order.items?.length > 0 && (
                <div style={{ marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.3rem 0.6rem', background:'rgba(255,255,255,0.04)', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize:'0.78rem', color:'var(--color-text-muted)' }}>
                        {item.name || item.product?.name || 'Item'} × {item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span style={{ fontSize:'0.75rem', color:'var(--color-text-dim)', alignSelf:'center' }}>+{order.items.length - 4} more</span>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;
