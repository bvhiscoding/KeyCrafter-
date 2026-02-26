import { useState } from 'react';
import {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/features/admin/adminApi';
import AdminTable from '@/modules/admin/shared/AdminTable';
import CrudFormModal from '@/modules/admin/shared/CrudFormModal';

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const FIELDS = [
  { key: 'name',        label: 'Name',        placeholder: 'e.g. Mechanical Keyboard', required: true },
  { key: 'description', label: 'Description', placeholder: 'Optional description...', rows: 3 },
];

const COLUMNS = [
  { key: 'name',         label: 'Name',        render: (row) => <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#e8e8ff' }}>{row.name}</span> },
  { key: 'slug',         label: 'Slug',        render: (row) => <span style={{ color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>{row.slug}</span> },
  { key: 'description',  label: 'Description', render: (row) => <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{row.description || '—'}</span> },
  { key: 'productCount', label: 'Products',    render: (row) => <span style={{ textAlign: 'center', display: 'block' }}>{row.productCount ?? '-'}</span> },
];

const Categories = () => {
  const { data, isLoading } = useGetAdminCategoriesQuery({});
  const [createCategory]  = useCreateCategoryMutation();
  const [updateCategory]  = useUpdateCategoryMutation();
  const [deleteCategory]  = useDeleteCategoryMutation();

  const categories = data?.data?.items ?? data?.data ?? data?.categories ?? [];

  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState(null);

  const openCreate = () => { setEditTarget(null); setMsg(null); setShowForm(true); };
  const openEdit   = (cat) => { setEditTarget(cat); setMsg(null); setShowForm(true); };

  const handleSave = async (values) => {
    setSaving(true);
    setMsg(null);
    try {
      if (editTarget) {
        await updateCategory({ id: editTarget._id, ...values }).unwrap();
        setMsg({ type: 'success', text: 'Category updated!' });
      } else {
        await createCategory(values).unwrap();
        setMsg({ type: 'success', text: 'Category created!' });
      }
      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      setMsg({ type: 'error', text: err?.data?.message || 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try { await deleteCategory(cat._id).unwrap(); }
    catch (err) { alert(err?.data?.message || 'Delete failed.'); }
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem' }}>Categories</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button type="button" onClick={openCreate} className="button button-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem' }}>
          <PlusIcon /> New Category
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <CrudFormModal
          title={editTarget ? 'Edit Category' : 'New Category'}
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
        rows={categories}
        isLoading={isLoading}
        emptyMessage="No categories yet."
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </section>
  );
};

export default Categories;
