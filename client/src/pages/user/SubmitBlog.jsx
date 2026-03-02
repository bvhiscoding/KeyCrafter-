import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  useCreateMyBlogMutation,
  useUpdateMyBlogMutation,
} from "@/modules/blog/api/blog.api";

const CATEGORIES = [
  { value: "review", label: "⭐ Review" },
  { value: "comparison", label: "⚖️ Comparison" },
  { value: "guide", label: "📖 Guide" },
  { value: "news", label: "📰 News" },
  { value: "keycap", label: "🔤 Keycap" },
  { value: "switch", label: "🔴 Switch" },
  { value: "keyboard", label: "⌨️ Keyboard" },
  { value: "custom", label: "🛠️ Custom Build" },
  { value: "other", label: "📝 Other" },
];

const STATUSES = [
  { value: "draft", label: "Draft (Save for later)" },
  { value: "pending", label: "Pending Review (Submit)" },
];

const DEFAULT_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "other",
  tags: "",
  rating: "",
  status: "draft",
};

// ── Styled Helpers ────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      width: "100%",
    }}
  >
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-display)",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {label}
    </label>
    {children}
    {hint && (
      <p
        style={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.4)",
          marginTop: "0.25rem",
        }}
      >
        {hint}
      </p>
    )}
  </div>
);

const sharedInputStyle = {
  width: "100%",
  padding: "0.8rem 1rem",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.2s",
};

const handleInputFocus = (e) => {
  e.target.style.borderColor = "var(--color-neon-cyan)";
  e.target.style.boxShadow = "0 0 10px rgba(0,245,255,0.1)";
};

const handleInputBlur = (e) => {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  e.target.style.boxShadow = "none";
};

// ── Main component ────────────────────────────────────────────────────────────
const SubmitBlog = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [createMyBlog, { isLoading: creating }] = useCreateMyBlogMutation();
  const [updateMyBlog, { isLoading: updating }] = useUpdateMyBlogMutation();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (isEdit && location.state?.blog) {
      const b = location.state.blog;
      if (b.status === "published") {
        navigate("/blog/my-posts", { replace: true });
        return;
      }
      setForm({
        title: b.title || "",
        excerpt: b.excerpt || "",
        content: b.content || "",
        coverImage: b.coverImage || "",
        category: b.category || "other",
        tags: (b.tags || []).join(", "),
        rating: b.rating ?? "",
        status: b.status === "archived" ? "draft" : b.status || "draft",
      });
    } else if (isEdit) {
      navigate("/blog/my-posts", { replace: true });
    }
  }, [isEdit, location.state, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required");
    if (!form.content.trim()) return setError("Content is required");

    const tagsArr = form.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      ...form,
      tags: tagsArr,
      rating: form.rating !== "" ? Number(form.rating) : null,
    };

    try {
      if (isEdit) {
        await updateMyBlog({ id, ...payload }).unwrap();
      } else {
        await createMyBlog(payload).unwrap();
      }
      navigate("/blog/my-posts");
    } catch (err) {
      setError(err?.data?.message || "An error occurred, please try again");
    }
  };

  const isSaving = creating || updating;
  const wordCount = form.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <section className="container" style={{ padding: "3rem 0 5rem" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 900,
            color: "#fff",
            marginBottom: "0.2rem",
          }}
        >
          {isEdit ? "✏️ Edit Post" : "📝 Submit New Post"}
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {wordCount} words · ~{readTime} min read
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <style>{`
          @media (max-width: 1024px) {
            form { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* ── Left: main content ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Title and Excerpt */}
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <Field label="Post Title *">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Gateron Yellow Review – Best budget switch"
                style={{
                  ...sharedInputStyle,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
              />
            </Field>

            <Field
              label="Excerpt"
              hint="Displayed in list view, max 500 characters"
            >
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short description of the post..."
                rows={2}
                maxLength={500}
                style={{
                  ...sharedInputStyle,
                  resize: "vertical",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </Field>
          </div>

          {/* Editor Tabs & Body */}
          <div>
            <div
              style={{
                display: "flex",
                gap: "0.2rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "-1px",
              }}
            >
              {["content", "preview"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.8rem 1.5rem",
                    background:
                      activeTab === tab ? "rgba(13,13,40,0.6)" : "transparent",
                    border: "1px solid",
                    borderColor:
                      activeTab === tab
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                    borderBottomColor:
                      activeTab === tab
                        ? "transparent"
                        : "rgba(255,255,255,0.1)",
                    borderRadius: "8px 8px 0 0",
                    color:
                      activeTab === tab ? "#fff" : "var(--color-text-muted)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tab === "content" ? "📝 Content" : "👁 Preview"}
                </button>
              ))}
            </div>

            <div
              className="glass-card"
              style={{
                padding: "1.5rem",
                borderRadius: "0 8px 8px 8px",
                minHeight: "450px",
              }}
            >
              {activeTab === "content" ? (
                <Field
                  label="Content *"
                  hint="Basic HTML supported. Line breaks are mapped to <br>"
                >
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Write your post content here..."
                    rows={20}
                    required
                    style={{
                      ...sharedInputStyle,
                      resize: "vertical",
                      fontFamily: "var(--font-mono)",
                      lineHeight: "1.6",
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </Field>
              ) : (
                <div>
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "rgba(0,245,255,0.05)",
                      border: "1px solid rgba(0,245,255,0.2)",
                      borderRadius: "8px",
                      marginBottom: "1.5rem",
                      fontSize: "0.8rem",
                      color: "var(--color-neon-cyan)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Preview is an estimation · Render may vary slightly when
                    published
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: "#fff",
                      marginBottom: "1rem",
                    }}
                  >
                    {form.title || "Post Title"}
                  </h2>
                  {form.excerpt && (
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        marginBottom: "2rem",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                      }}
                    >
                      {form.excerpt}
                    </p>
                  )}
                  <div
                    style={{
                      color: "#e8e8ff",
                      lineHeight: "1.8",
                      fontSize: "1.05rem",
                      whiteSpace: "pre-wrap",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: form.content
                        ? DOMPurify.sanitize(
                            form.content.replace(/\n/g, "<br />"),
                          )
                        : "<em>No content</em>",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: settings sidebar ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#fff",
                uppercase: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "1rem",
              }}
            >
              Publish Settings
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field label="Action">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={{
                    ...sharedInputStyle,
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}
                >
                  {STATUSES.map((s) => (
                    <option
                      key={s.value}
                      value={s.value}
                      style={{ background: "#0d0d28" }}
                    >
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Category">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{
                    ...sharedInputStyle,
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      style={{ background: "#0d0d28" }}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {(form.category === "review" || form.category === "comparison") && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <Field
                label="Rating (1-10)"
                hint="For review/comparison categories only"
              >
                <input
                  name="rating"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  style={sharedInputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </Field>
              {form.rating && (
                <div
                  style={{
                    marginTop: "1rem",
                    height: "6px",
                    borderRadius: "99px",
                    background: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "99px",
                      transition: "width 0.3s",
                      width: `${(Number(form.rating) / 10) * 100}%`,
                      backgroundColor:
                        Number(form.rating) >= 8
                          ? "#39ff14"
                          : Number(form.rating) >= 6
                            ? "#00f5ff"
                            : "#ffcc00",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <Field
              label="Tags"
              hint="Comma separated. e.g. cherry mx, switch, tactile"
            >
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="cherry mx, switch, 65%..."
                style={sharedInputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </Field>

            <Field label="Cover Image URL" hint="Paste image URL string">
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://..."
                style={sharedInputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </Field>

            {form.coverImage && (
              <div
                style={{
                  height: "140px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                padding: "1rem",
                background: "rgba(255,50,50,0.1)",
                border: "1px solid rgba(255,50,50,0.3)",
                borderRadius: "8px",
                color: "#ff5555",
                fontSize: "0.85rem",
                fontFamily: "var(--font-display)",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <button
              type="submit"
              disabled={isSaving}
              className={isSaving ? "button" : "button button-primary"}
              style={{
                padding: "1rem",
                width: "100%",
                background: isSaving ? "transparent" : undefined,
                border: isSaving ? "1px solid rgba(0,245,255,0.3)" : undefined,
                color: isSaving ? "rgba(0,245,255,0.6)" : undefined,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving
                ? "Saving..."
                : isEdit
                  ? "💾 Save Changes"
                  : "🚀 Submit Post"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/blog/my-posts")}
              className="button"
              style={{
                width: "100%",
                padding: "0.85rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "var(--color-text-muted)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor =
                  "var(--color-border-bright)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SubmitBlog;
