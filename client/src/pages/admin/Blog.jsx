import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetAdminBlogsQuery,
  useToggleBlogPublishMutation,
  useDeleteBlogMutation,
} from "@/modules/blog/api/blog.api";
import Loader from "@/components/common/Loader";

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
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
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CATEGORY_LABELS = {
  review: "Review",
  comparison: "Comparison",
  guide: "Guide",
  news: "News",
  keycap: "Keycap",
  switch: "Switch",
  keyboard: "Keyboard",
  custom: "Custom",
  other: "Other",
};

const STATUS_COLORS = {
  published: {
    bg: "rgba(57,255,20,0.08)",
    color: "#39ff14",
    border: "rgba(57,255,20,0.25)",
  },
  draft: {
    bg: "rgba(255,204,0,0.08)",
    color: "#ffcc00",
    border: "rgba(255,204,0,0.3)",
  },
  archived: {
    bg: "rgba(100,100,100,0.08)",
    color: "#888",
    border: "rgba(100,100,100,0.2)",
  },
};

const STATUS_LABELS = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

const AdminBlog = () => {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading } = useGetAdminBlogsQuery(params);
  const [togglePublish] = useToggleBlogPublishMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const blogs = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const handleToggle = async (id) => {
    try {
      await togglePublish(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteBlog(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete");
    }
  };

  if (isLoading) return <Loader message="Loading blog posts..." />;

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.25rem",
            }}
          >
            Blog
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
            {pagination?.total ?? 0} posts · Manage blog content
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.55rem 1rem",
            background: "rgba(0,245,255,0.08)",
            border: "1px solid rgba(0,245,255,0.3)",
            color: "var(--color-neon-cyan)",
            borderRadius: "9px",
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <PlusIcon /> New Post
        </Link>
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {["", "published", "draft", "archived"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() =>
              setParams((p) => ({ ...p, status: s || undefined, page: 1 }))
            }
            style={{
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "0.74rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              cursor: "pointer",
              border:
                (params.status ?? "") === s
                  ? "1px solid var(--color-neon-cyan)"
                  : "1px solid rgba(255,255,255,0.12)",
              background:
                (params.status ?? "") === s
                  ? "rgba(0,245,255,0.08)"
                  : "transparent",
              color:
                (params.status ?? "") === s
                  ? "var(--color-neon-cyan)"
                  : "var(--color-text-muted)",
            }}
          >
            {s === "" ? "All" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      {blogs.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>
            No posts found.
          </p>
          <Link
            to="/admin/blog/new"
            style={{
              color: "var(--color-neon-cyan)",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
              display: "inline-block",
            }}
          >
            Create first post →
          </Link>
        </div>
      ) : (
        <div
          className="glass-card"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  "Title",
                  "Category",
                  "Status",
                  "Views",
                  "Created Date",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--color-text-dim)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, i) => {
                const sc = STATUS_COLORS[blog.status] || STATUS_COLORS.draft;
                return (
                  <tr
                    key={blog._id}
                    style={{
                      borderBottom:
                        i < blogs.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Title */}
                    <td style={{ padding: "0.85rem 1rem", maxWidth: "280px" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.84rem",
                          fontWeight: 700,
                          color: "#e8e8ff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {blog.isFeatured && (
                          <span
                            style={{ color: "#ffcc00", marginRight: "0.25rem" }}
                          >
                            ⭐
                          </span>
                        )}
                        {blog.title}
                      </p>
                      {blog.excerpt && (
                        <p
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--color-text-dim)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {blog.excerpt}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {CATEGORY_LABELS[blog.category] || blog.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <button
                        type="button"
                        onClick={() => handleToggle(blog._id)}
                        title="Click to toggle publish"
                        style={{
                          padding: "3px 10px",
                          borderRadius: "99px",
                          fontSize: "0.66rem",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          cursor: "pointer",
                        }}
                      >
                        {STATUS_LABELS[blog.status]}
                      </button>
                    </td>

                    {/* Views */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {blog.viewCount || 0}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        {new Date(blog.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.35rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        {blog.status === "published" && (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.2rem",
                              padding: "0.3rem 0.65rem",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "var(--color-text-muted)",
                              borderRadius: "6px",
                              fontSize: "0.72rem",
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >
                            <EyeIcon />
                          </a>
                        )}
                        <Link
                          to={`/admin/blog/${blog._id}/edit`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            padding: "0.3rem 0.65rem",
                            background: "rgba(0,245,255,0.06)",
                            border: "1px solid rgba(0,245,255,0.2)",
                            color: "var(--color-neon-cyan)",
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          <EditIcon /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog._id, blog.title)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            padding: "0.3rem 0.65rem",
                            background: "rgba(255,50,50,0.06)",
                            border: "1px solid rgba(255,50,50,0.18)",
                            color: "#ff5555",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.72rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          style={{ display: "flex", justifyContent: "center", gap: "0.4rem" }}
        >
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                type="button"
                onClick={() => setParams((prev) => ({ ...prev, page: p }))}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  border:
                    p === params.page
                      ? "1px solid var(--color-neon-cyan)"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    p === params.page ? "rgba(0,245,255,0.08)" : "transparent",
                  color:
                    p === params.page
                      ? "var(--color-neon-cyan)"
                      : "var(--color-text-muted)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ),
          )}
        </div>
      )}
    </section>
  );
};

export default AdminBlog;
