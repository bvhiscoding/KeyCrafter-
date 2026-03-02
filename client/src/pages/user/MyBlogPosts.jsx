import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyBlogsQuery } from "@/modules/blog/api/blog.api";

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
  published: { bg: "rgba(57,255,20,0.08)", color: "#39ff14", border: "rgba(57,255,20,0.25)" },
  draft: { bg: "rgba(255,204,0,0.08)", color: "#ffcc00", border: "rgba(255,204,0,0.3)" },
  pending: { bg: "rgba(0,245,255,0.08)", color: "#00f5ff", border: "rgba(0,245,255,0.3)" },
  archived: { bg: "rgba(255,50,50,0.08)", color: "#ff5555", border: "rgba(255,50,50,0.2)" },
};

const STATUS_LABELS = {
  published: "Published",
  draft: "Draft",
  pending: "Pending",
  archived: "Archived",
};

const MyBlogPosts = () => {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { data, isLoading, error } = useGetMyBlogsQuery(params);

  const blogs = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem", color: "var(--color-neon-cyan)" }}>
        Loading your posts...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#ff5555" }}>
        Failed to load posts. Please try again.
      </div>
    );
  }

  return (
    <section className="container" style={{ padding: "3rem 0 5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "0.2rem" }}>
            My Blog Posts
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            {pagination?.total ?? 0} posts · Share your setups and stories
          </p>
        </div>
        <Link to="/blog/my-posts/new" className="button button-primary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem", gap: "0.5rem" }}>
          <PlusIcon /> New Post
        </Link>
      </div>

      {/* Filter Row */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {["", "published", "draft", "pending", "archived"].map((s) => {
          const isActive = (params.status ?? "") === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setParams((p) => ({ ...p, status: s || undefined, page: 1 }))}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "99px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid",
                background: isActive ? "rgba(0,245,255,0.08)" : "transparent",
                borderColor: isActive ? "var(--color-neon-cyan)" : "rgba(255,255,255,0.1)",
                color: isActive ? "var(--color-neon-cyan)" : "var(--color-text-muted)",
              }}
            >
              {s === "" ? "All" : STATUS_LABELS[s]}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {blogs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "4rem 2rem", borderRadius: "16px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✍️</div>
          <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem" }}>
            You haven't written any posts yet.
          </p>
          <Link to="/blog/my-posts/new" style={{ color: "var(--color-neon-cyan)", fontWeight: 700, fontSize: "0.9rem" }}>
            Start your first draft &rarr;
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Title", "Category", "Status", "Views", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "1rem 1.25rem",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "var(--color-text-dim)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        whiteSpace: "nowrap",
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
                        borderBottom: i < blogs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "1.25rem", maxWidth: "300px" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {blog.title}
                        </div>
                        {blog.excerpt && (
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {blog.excerpt}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1.25rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {CATEGORY_LABELS[blog.category] || blog.category}
                      </td>
                      <td style={{ padding: "1.25rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "99px",
                            fontSize: "0.65rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            background: sc.bg,
                            color: sc.color,
                            border: `1px solid ${sc.border}`,
                          }}
                        >
                          {STATUS_LABELS[blog.status] || blog.status}
                        </span>
                      </td>
                      <td style={{ padding: "1.25rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        {blog.viewCount || 0}
                      </td>
                      <td style={{ padding: "1.25rem", fontSize: "0.8rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(blog.createdAt).toLocaleDateString("en-US")}
                      </td>
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.4rem 0.6rem",
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "var(--color-text-muted)",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              textDecoration: "none",
                              transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = "#fff";
                              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = "var(--color-text-muted)";
                              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            }}
                          >
                            <EyeIcon /> View
                          </Link>
                          {blog.status !== "published" && (
                            <Link
                              to={`/blog/my-posts/${blog._id}/edit`}
                              state={{ blog }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                padding: "0.4rem 0.6rem",
                                background: "rgba(0,245,255,0.06)",
                                border: "1px solid rgba(0,245,255,0.2)",
                                color: "var(--color-neon-cyan)",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                textDecoration: "none",
                                transition: "all 0.2s"
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,245,255,0.15)"}
                              onMouseOut={(e) => e.currentTarget.style.background = "rgba(0,245,255,0.06)"}
                            >
                              <EditIcon /> Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = p === params.page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setParams((prev) => ({ ...prev, page: p }))}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  cursor: "pointer",
                  background: isActive ? "rgba(0,245,255,0.1)" : "transparent",
                  borderColor: isActive ? "var(--color-neon-cyan)" : "rgba(255,255,255,0.1)",
                  color: isActive ? "var(--color-neon-cyan)" : "var(--color-text-muted)",
                  transition: "all 0.2s"
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyBlogPosts;
