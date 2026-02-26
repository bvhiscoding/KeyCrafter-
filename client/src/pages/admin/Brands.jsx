import { useState } from "react";
import {
  useGetAdminBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/features/admin/adminApi";
import AdminTable from "@/modules/admin/shared/AdminTable";
import CrudFormModal from "@/modules/admin/shared/CrudFormModal";

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
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

const FIELDS = [
  { key: "name", label: "Name", placeholder: "e.g. Leopold", required: true },
  {
    key: "website",
    label: "Website",
    placeholder: "https://leopoldco.com",
    type: "url",
  },
  {
    key: "description",
    label: "Description",
    placeholder: "Short brand bio…",
    rows: 2,
  },
];

const COLUMNS = [
  {
    key: "name",
    label: "Brand",
    render: (row) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
        {row.logo && (
          <img
            src={row.logo}
            alt=""
            style={{
              width: 28,
              height: 28,
              objectFit: "contain",
              borderRadius: 4,
            }}
          />
        )}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "#e8e8ff",
          }}
        >
          {row.name}
        </span>
      </div>
    ),
  },
  {
    key: "slug",
    label: "Slug",
    render: (row) => (
      <span style={{ color: "var(--color-text-dim)", fontSize: "0.78rem" }}>
        {row.slug}
      </span>
    ),
  },
  {
    key: "website",
    label: "Website",
    render: (row) =>
      row.website ? (
        <a
          href={row.website}
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--color-neon-cyan)", textDecoration: "none" }}
        >
          ↗ Link
        </a>
      ) : (
        "—"
      ),
  },
  {
    key: "productCount",
    label: "Products",
    render: (row) => (
      <span style={{ display: "block", textAlign: "center" }}>
        {row.productCount ?? "-"}
      </span>
    ),
  },
];

const Brands = () => {
  const { data, isLoading } = useGetAdminBrandsQuery({});
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const rawBrands = data?.data?.items ?? data?.data ?? data?.brands;
  const brands = Array.isArray(rawBrands) ? rawBrands : [];

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const openCreate = () => {
    setEditTarget(null);
    setMsg(null);
    setShowForm(true);
  };
  const openEdit = (b) => {
    setEditTarget(b);
    setMsg(null);
    setShowForm(true);
  };

  const handleSave = async (values) => {
    setSaving(true);
    setMsg(null);
    try {
      if (editTarget) {
        await updateBrand({ id: editTarget._id, ...values }).unwrap();
        setMsg({ type: "success", text: "Brand updated!" });
      } else {
        await createBrand(values).unwrap();
        setMsg({ type: "success", text: "Brand created!" });
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      setMsg({ type: "error", text: err?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Delete brand "${brand.name}"?`)) return;
    try {
      await deleteBrand(brand._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Delete failed.");
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
            Brands
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
            {brands.length} brand{brands.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="button button-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 1.1rem",
          }}
        >
          <PlusIcon /> New Brand
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <CrudFormModal
          title={editTarget ? "Edit Brand" : "New Brand"}
          fields={FIELDS}
          initialValues={editTarget ?? {}}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
          saving={saving}
          serverMessage={msg}
        />
      )}

      {/* Table */}
      <AdminTable
        columns={COLUMNS}
        rows={brands}
        isLoading={isLoading}
        emptyMessage="No brands yet."
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </section>
  );
};

export default Brands;
