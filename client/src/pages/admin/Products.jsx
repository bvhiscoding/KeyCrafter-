import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
} from "@/features/admin/adminApi";
import Loader from "@/components/common/Loader";

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAdminProductsQuery({ search });
  const [deleteProduct] = useDeleteProductMutation();
  const raw = data?.data?.items ?? data?.data ?? data?.products;
  const products = Array.isArray(raw) ? raw : [];

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete.");
    }
  };

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.2rem",
            }}
          >
            Products
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="button button-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 1.1rem",
          }}
        >
          <PlusIcon /> New Product
        </Link>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: "1rem 1.25rem" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-dim)",
              pointerEvents: "none",
            }}
          >
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "8px",
              padding: "0.55rem 0.75rem 0.55rem 2.2rem",
              color: "var(--color-text)",
              fontSize: "0.85rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        {isLoading ? (
          <Loader message="Loading products..." />
        ) : products.length === 0 ? (
          <p
            style={{
              padding: "2rem",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            No products found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.83rem",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                  {[
                    "Product",
                    "Category",
                    "Brand",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: "var(--color-text-muted)",
                        borderBottom: "1px solid rgba(0,245,255,0.1)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(0,245,255,0.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                        }}
                      >
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              width: "36px",
                              height: "36px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid rgba(0,245,255,0.15)",
                            }}
                          />
                        )}
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: "#e8e8ff",
                              fontSize: "0.83rem",
                            }}
                          >
                            {p.name}
                          </p>
                          <p
                            style={{
                              color: "var(--color-text-dim)",
                              fontSize: "0.72rem",
                            }}
                          >
                            {p.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {p.category?.name || p.category || "—"}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {p.brand?.name || p.brand || "—"}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        fontFamily: "var(--font-display)",
                        color: "var(--color-neon-cyan)",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {(p.price || 0).toLocaleString("vi-VN")} ₫
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          padding: "0.15rem 0.5rem",
                          borderRadius: "99px",
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          background:
                            (p.stock || p.countInStock || 0) > 0
                              ? "rgba(57,255,20,0.08)"
                              : "rgba(255,50,50,0.1)",
                          color:
                            (p.stock || p.countInStock || 0) > 0
                              ? "#39ff14"
                              : "#ff5555",
                          border: `1px solid ${(p.stock || p.countInStock || 0) > 0 ? "rgba(57,255,20,0.25)" : "rgba(255,50,50,0.25)"}`,
                        }}
                      >
                        {(p.stock || p.countInStock || 0) > 0
                          ? p.stock || p.countInStock
                          : "Out"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          style={{
                            padding: "0.3rem 0.55rem",
                            background: "rgba(0,245,255,0.08)",
                            border: "1px solid rgba(0,245,255,0.2)",
                            color: "var(--color-neon-cyan)",
                            borderRadius: "6px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            textDecoration: "none",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                          }}
                        >
                          <EditIcon /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p._id, p.name)}
                          style={{
                            padding: "0.3rem 0.55rem",
                            background: "rgba(255,50,50,0.08)",
                            border: "1px solid rgba(255,50,50,0.2)",
                            color: "#ff5555",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                          }}
                        >
                          <TrashIcon /> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProducts;
