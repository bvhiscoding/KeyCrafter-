import { useState } from "react";

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const labelStyle = {
  display: "block",
  marginBottom: "0.3rem",
  fontSize: "0.72rem",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.1em",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(0,245,255,0.15)",
  borderRadius: "8px",
  padding: "0.55rem 0.75rem",
  color: "var(--color-text)",
  fontSize: "0.85rem",
  outline: "none",
  boxSizing: "border-box",
};

/**
 * CrudFormModal — inline form panel for create/edit operations.
 *
 * @param {{
 *   title: string,
 *   fields: Array<{ key: string, label: string, type?: string, placeholder?: string, required?: boolean, rows?: number }>,
 *   initialValues?: Record<string, string>,
 *   onClose: () => void,
 *   onSubmit: (values: Record<string, string>) => Promise<void>,
 *   saving?: boolean,
 *   serverMessage?: { type: 'success' | 'error', text: string } | null,
 * }} props
 */
const CrudFormModal = ({
  title,
  fields,
  initialValues = {},
  onClose,
  onSubmit,
  saving = false,
  serverMessage = null,
}) => {
  const [values, setValues] = useState(() =>
    fields.reduce(
      (acc, f) => ({ ...acc, [f.key]: initialValues[f.key] ?? "" }),
      {},
    ),
  );

  const handleChange = (key, value) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(values);
  };

  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            padding: "0.25rem",
          }}
        >
          <XIcon />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.85rem" }}>
        {fields.map((field) => (
          <div key={field.key}>
            <label htmlFor={`crud-${field.key}`} style={labelStyle}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.rows ? (
              <textarea
                id={`crud-${field.key}`}
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            ) : (
              <input
                id={`crud-${field.key}`}
                type={field.type ?? "text"}
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                style={inputStyle}
              />
            )}
          </div>
        ))}

        {serverMessage && (
          <p
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "7px",
              fontSize: "0.8rem",
              background:
                serverMessage.type === "success"
                  ? "rgba(57,255,20,0.08)"
                  : "rgba(255,50,50,0.08)",
              border: `1px solid ${serverMessage.type === "success" ? "rgba(57,255,20,0.25)" : "rgba(255,50,50,0.25)"}`,
              color: serverMessage.type === "success" ? "#39ff14" : "#ff5555",
            }}
          >
            {serverMessage.text}
          </p>
        )}

        <div style={{ display: "flex", gap: "0.65rem" }}>
          <button
            type="submit"
            className="button button-primary"
            disabled={saving}
            style={{
              padding: "0.6rem 1.1rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            {saving
              ? "Saving..."
              : title.startsWith("Edit")
                ? "Save Changes"
                : "Create"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="button button-secondary"
            style={{ padding: "0.6rem 0.9rem" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrudFormModal;
