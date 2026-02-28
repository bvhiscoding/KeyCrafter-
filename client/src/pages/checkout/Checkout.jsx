import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/features/orders/orders.api";
import { useMergeGuestCartMutation } from "@/features/cart/cart.api";
import { useGetProfileQuery } from "@/features/user/user.api";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";

const Checkout = () => {
  const { subtotal, resetCart, items } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profileData } = useGetProfileQuery(undefined, { skip: !user });
  const addresses = profileData?.data?.addresses || user?.addresses || [];

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [mergeGuestCart, { isLoading: isMerging }] =
    useMergeGuestCartMutation();

  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    note: "",
    paymentMethod: "cod",
  });

  // Pre-fill with default address if available and user hasn't selected anything yet.
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === "new") {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        setFormData((prev) => ({
          ...prev,
          name: defaultAddr.name || "",
          phone: defaultAddr.phone || "",
          address: defaultAddr.address || "",
          ward: defaultAddr.ward || "",
          district: defaultAddr.district || "",
          city: defaultAddr.city || "",
        }));
      }
    }
  }, [addresses]); // intentional: trigger when addresses load.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (e) => {
    const val = e.target.value;
    setSelectedAddressId(val);

    if (val === "new") {
      setFormData((prev) => ({
        ...prev,
        name: "",
        phone: "",
        address: "",
        ward: "",
        district: "",
        city: "",
      }));
    } else {
      const addr = addresses.find((a) => a._id === val);
      if (addr) {
        setFormData((prev) => ({
          ...prev,
          name: addr.name || "",
          phone: addr.phone || "",
          address: addr.address || "",
          ward: addr.ward || "",
          district: addr.district || "",
          city: addr.city || "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Push local cart to user's backend Cart
      const cartItemsPayload = items.map((item) => ({
        productId: item._id || item.id,
        quantity: item.quantity,
      }));

      if (cartItemsPayload.length > 0) {
        await mergeGuestCart({ items: cartItemsPayload }).unwrap();
      }

      // Step 2: Create Order from backend Cart
      const orderData = {
        shippingAddress: {
          name: formData.name,
          phone: formData.phone.replace(/\s+/g, ""),
          address: formData.address,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
        },
        paymentMethod: formData.paymentMethod,
        shippingFee: 0,
        note: formData.note,
      };

      await createOrder(orderData).unwrap();

      alert("Order placed successfully!");
      if (resetCart) resetCart();
      navigate("/orders");
    } catch (error) {
      console.error(error);
      let errMsg = error?.data?.message || "Failed to place order";
      if (
        error?.data?.details &&
        Array.isArray(error.data.details) &&
        error.data.details.length > 0
      ) {
        errMsg = error.data.details.join(", ").replace(/"/g, "");
        errMsg = errMsg.charAt(0).toUpperCase() + errMsg.slice(1);
      }
      alert(errMsg);
    }
  };

  return (
    <section
      className="card stack-md container"
      style={{ padding: "2rem", maxWidth: "800px" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          marginBottom: "0.5rem",
        }}
      >
        Checkout
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
        Delivery information and order summary.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
        {user && addresses.length > 0 && (
          <div
            style={{
              padding: "1.25rem",
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "10px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.8rem",
                color: "var(--color-neon-cyan)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 700,
              }}
            >
              Select Saved Address
            </label>
            <select
              value={selectedAddressId}
              onChange={handleAddressSelect}
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "rgba(13,13,40,0.8)",
                color: "#fff",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "6px",
                outline: "none",
              }}
            >
              {addresses.map((a) => (
                <option key={a._id} value={a._id}>
                  [{a.label?.toUpperCase()}] {a.name} - {a.phone}
                </option>
              ))}
              <option value="new">+ Enter a new address manually</option>
            </select>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}
            >
              Full Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "white",
              }}
            />
          </div>
          <div>
            <label
              style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}
            >
              Phone Number
            </label>
            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0912345678"
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "white",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
            Street Address
          </label>
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Example Street"
            style={{
              width: "100%",
              padding: "0.6rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "white",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}
            >
              Ward
            </label>
            <input
              required
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="Ben Nghe Ward"
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "white",
              }}
            />
          </div>
          <div>
            <label
              style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}
            >
              District
            </label>
            <input
              required
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="District 1"
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "white",
              }}
            />
          </div>
          <div>
            <label
              style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}
            >
              City
            </label>
            <input
              required
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ho Chi Minh City"
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "white",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
            Order Note (Optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Any delivery instructions..."
            rows="3"
            style={{
              width: "100%",
              padding: "0.6rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: "white",
              resize: "vertical",
            }}
          />
        </div>

        <div
          style={{
            padding: "1.2rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              margin: "0 0 0.85rem 0",
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Payment Method
          </p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
                style={{ accentColor: "var(--color-neon-cyan)" }}
              />
              <span>Cash on Delivery (COD)</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                fontSize: "0.95rem",
                opacity: 0.8,
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={formData.paymentMethod === "stripe"}
                onChange={handleChange}
                style={{ accentColor: "var(--color-neon-cyan)" }}
              />
              <span>Credit Card (Stripe)</span>
            </label>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            Total Payment:{" "}
            <strong
              style={{ color: "var(--color-neon-cyan)", marginLeft: "0.5rem" }}
            >
              {subtotal.toLocaleString("vi-VN")} VND
            </strong>
          </div>
          <button
            type="submit"
            className="button button-primary"
            disabled={isLoading || isMerging}
            style={{ padding: "0.8rem 2.5rem", fontSize: "1rem" }}
          >
            {isLoading || isMerging ? "Processing..." : "Place Order →"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Checkout;
