import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '@/features/orders/ordersApi';
import useCart from '@/hooks/useCart';

const Checkout = () => {
  const { subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    ward: 'Ward 1',
    district: 'District 1',
    city: 'HCMC',
    note: '',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
        },
        paymentMethod: formData.paymentMethod,
        shippingFee: 0,
        note: formData.note,
      };

      const res = await createOrder(orderData).unwrap();
      
      // Clear local cart completely or via Redux
      // For this demo, let's navigate to orders page
      alert('Order placed successfully!');
      if (clearCart) clearCart();
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || 'Failed to place order');
    }
  };

  return (
    <section className="card stack-md container" style={{ padding: '2rem' }}>
      <h1>Checkout</h1>
      <p className="muted">
        Fill out your shipping information to place your order.
      </p>

      <form onSubmit={handleSubmit} className="stack-sm">
        <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ và tên" />
        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại (ex: +84...)" />
        <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ giao hàng" />
        <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú đơn hàng" rows="4" />

        <label className="inline-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <label>
            <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} /> COD
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === 'stripe'} onChange={handleChange} /> Stripe
          </label>
        </label>

        <p style={{ marginTop: '1rem' }}>
          Total: <strong>{subtotal.toLocaleString('vi-VN')} VND</strong>
        </p>

        <button type="submit" className="button button-primary" disabled={isLoading} style={{ marginTop: '1rem' }}>
          {isLoading ? 'Processing...' : 'Place order'}
        </button>
      </form>
    </section>
  );
};

export default Checkout;
