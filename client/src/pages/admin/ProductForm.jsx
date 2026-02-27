import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
} from "@/features/admin/adminApi";
import {
  useGetAdminCategoriesQuery,
  useGetAdminBrandsQuery,
} from "@/features/admin/adminApi";
import Loader from "@/components/common/Loader";

const BackIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const UploadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(0,245,255,0.15)",
  borderRadius: "8px",
  padding: "0.65rem 0.85rem",
  color: "var(--color-text)",
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
};
const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: "block",
      marginBottom: "0.35rem",
      fontSize: "0.73rem",
      fontFamily: "var(--font-display)",
      letterSpacing: "0.1em",
      color: "var(--color-text-muted)",
      textTransform: "uppercase",
    }}
  >
    {children}
  </label>
);

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  /* ── API hooks ── */
  const { data: productsData } = useGetAdminProductsQuery({});
  const { data: categoriesData } = useGetAdminCategoriesQuery({});
  const { data: brandsData } = useGetAdminBrandsQuery({});
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [uploadImages] = useUploadProductImagesMutation();

  const raw_cat =
    categoriesData?.data?.items ??
    categoriesData?.data ??
    categoriesData?.categories;
  const categories = Array.isArray(raw_cat) ? raw_cat : [];

  const raw_brand =
    brandsData?.data?.items ?? brandsData?.data ?? brandsData?.brands;
  const brands = Array.isArray(raw_brand) ? raw_brand : [];

  const raw_prod =
    productsData?.data?.items ?? productsData?.data ?? productsData?.products;
  const products = Array.isArray(raw_prod) ? raw_prod : [];

  /* ── Form state ── */
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    shortDescription: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  /* ── Load existing product if editing ── */
  useEffect(() => {
    if (isEdit && products.length) {
      const p = products.find((pr) => pr._id === id);
      if (p) {
        setForm({
          name: p.name || "",
          description: p.description || "",
          shortDescription: p.shortDescription || "",
          price: p.price || "",
          stock: p.stock ?? "",
          category: p.category?._id || p.category || "",
          brand: p.brand?._id || p.brand || "",
        });
        if (p.image) setPreview(p.image);
      }
    }
  }, [isEdit, products, id]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      let productId;

      if (isEdit) {
        const res = await updateProduct({ id, ...payload }).unwrap();
        productId = id;
        setMsg({ type: "success", text: "Product updated!" });
      } else {
        const res = await createProduct(payload).unwrap();
        productId = res.data?._id || res._id;
        setMsg({ type: "success", text: "Product created!" });
      }

      /* Upload image if selected */
      if (selectedFile && productId) {
        const fd = new FormData();
        fd.append("image", selectedFile);
        await uploadImages({ id: productId, formData: fd }).unwrap();
      }

      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.data?.message ||
          (Array.isArray(err?.data?.errors)
            ? err.data.errors.join(", ")
            : "Save failed. Please try again."),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ maxWidth: "1000px", width: "100%", margin: "0 auto" }}>
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "none",
          border: "none",
          color: "var(--color-text-muted)",
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          fontSize: "0.82rem",
          marginBottom: "1.5rem",
          padding: 0,
        }}
      >
        <BackIcon /> Back to Products
      </button>

      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.25rem",
          }}
        >
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
          {isEdit ? `Editing: ${id}` : "Fill in the product details below"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        {/* Left Column: Core Fields & Actions */}
        <div
          style={{
            flex: "1 1 500px",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Core fields */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1.25rem",
              }}
            >
              Product Info
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <Label htmlFor="pf-name">Product Name *</Label>
                <input
                  id="pf-name"
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Leopold FC660C"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <Label htmlFor="pf-short">Short Description</Label>
                <input
                  id="pf-short"
                  type="text"
                  value={form.shortDescription}
                  onChange={set("shortDescription")}
                  placeholder="One-line summary for cards"
                  style={inputStyle}
                />
              </div>
              <div>
                <Label htmlFor="pf-desc">Full Description</Label>
                <textarea
                  id="pf-desc"
                  value={form.description}
                  onChange={set("description")}
                  rows={4}
                  placeholder="Detailed description..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <Label htmlFor="pf-price">Price (VND) *</Label>
                  <input
                    id="pf-price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="1500000"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <Label htmlFor="pf-stock">Stock *</Label>
                  <input
                    id="pf-stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={set("stock")}
                    placeholder="50"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <Label htmlFor="pf-category">Category *</Label>
                  <select
                    id="pf-category"
                    value={form.category}
                    onChange={set("category")}
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="pf-brand">Brand *</Label>
                  <select
                    id="pf-brand"
                    value={form.brand}
                    onChange={set("brand")}
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Alert */}
          {msg && (
            <p
              style={{
                padding: "0.65rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.83rem",
                background:
                  msg.type === "success"
                    ? "rgba(57,255,20,0.08)"
                    : "rgba(255,50,50,0.08)",
                border: `1px solid ${msg.type === "success" ? "rgba(57,255,20,0.25)" : "rgba(255,50,50,0.25)"}`,
                color: msg.type === "success" ? "#39ff14" : "#ff5555",
              }}
            >
              {msg.text}
            </p>
          )}

          {/* Submit */}
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", marginTop: "1rem" }}>
            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes →"
                  : "Create Product →"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="button button-secondary"
              style={{ padding: "0.75rem 1rem" }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Column: Image Upload */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}
            >
              Product Image
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Preview */}
              <div
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "10px",
                  border: "2px dashed rgba(0,245,255,0.25)",
                  background: "rgba(0,245,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "rgba(0,245,255,0.3)",
                    }}
                  >
                    <UploadIcon />
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                      No image
                    </p>
                  </div>
                )}
              </div>
              <div style={{ width: "100%" }}>
                <label
                  htmlFor="product-image-upload"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    gap: "0.5rem",
                    padding: "0.8rem 1rem",
                    background: "rgba(0,245,255,0.08)",
                    border: "1px solid rgba(0,245,255,0.25)",
                    borderRadius: "8px",
                    color: "var(--color-neon-cyan)",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    boxSizing: "border-box",
                  }}
                >
                  <UploadIcon /> {preview ? "Change Image" : "Upload Image"}
                </label>
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
                <p
                  style={{
                    color: "var(--color-text-dim)",
                    fontSize: "0.75rem",
                    marginTop: "0.75rem",
                  }}
                >
                  JPEG, PNG, WebP · Max 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
