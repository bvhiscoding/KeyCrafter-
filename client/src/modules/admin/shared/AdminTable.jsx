import Loader from "@/components/common/Loader";

const EditIcon = () => (
  <svg
    width="13"
    height="13"
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
    width="13"
    height="13"
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

/**
 * AdminTable — reusable table for admin CRUD pages.
 *
 * @param {{
 *   columns: Array<{ key: string, label: string, render?: (row) => ReactNode }>,
 *   rows: unknown[],
 *   isLoading: boolean,
 *   emptyMessage?: string,
 *   onEdit?: (row) => void,
 *   onDelete?: (row) => void,
 *   getRowKey?: (row) => string,
 * }} props
 */
const AdminTable = ({
  columns,
  rows = [],
  isLoading,
  emptyMessage = "No items found.",
  onEdit,
  onDelete,
  getRowKey = (row) => row._id ?? row.id,
}) => {
  const hasActions = onEdit || onDelete;
  const allColumns = hasActions
    ? [...columns, { key: "__actions", label: "Actions" }]
    : columns;

  return (
    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
      {isLoading ? (
        <Loader message="Loading..." />
      ) : rows.length === 0 ? (
        <p
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--color-text-muted)",
          }}
        >
          {emptyMessage}
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
                {allColumns.map((col) => (
                  <th
                    key={col.key}
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
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(0,245,255,0.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "0.75rem 1rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}

                  {hasActions && (
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            style={{
                              padding: "0.3rem 0.55rem",
                              background: "rgba(0,245,255,0.08)",
                              border: "1px solid rgba(0,245,255,0.2)",
                              color: "var(--color-neon-cyan)",
                              borderRadius: "6px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.73rem",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                            }}
                          >
                            <EditIcon /> Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
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
                              fontSize: "0.73rem",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                            }}
                          >
                            <TrashIcon /> Del
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
