import {
  useGetAdminReviewsQuery,
  useApproveReviewMutation,
  useDeleteAdminReviewMutation,
} from "@/features/admin/adminApi";
import Loader from "@/components/common/Loader";

const StarIcon = ({ filled }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill={filled ? "#ffcc00" : "none"}
    stroke="#ffcc00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
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

const Reviews = () => {
  const { data, isLoading } = useGetAdminReviewsQuery({});
  const [approveReview] = useApproveReviewMutation();
  const [deleteReview] = useDeleteAdminReviewMutation();
  const reviews = data?.data?.items ?? data?.data ?? data?.reviews ?? [];

  const handleApprove = async (id) => {
    try {
      await approveReview(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed.");
    }
  };

  if (isLoading) return <Loader message="Loading reviews..." />;

  return (
    <section style={{ display: "grid", gap: "1.5rem" }}>
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
          Reviews
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} · Moderate
          customer feedback
        </p>
      </div>

      {reviews.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "2.5rem", textAlign: "center" }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>No reviews found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.85rem" }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              className="glass-card"
              style={{ padding: "1.25rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                {/* Left */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "rgba(0,245,255,0.1)",
                        border: "1px solid rgba(0,245,255,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "var(--color-neon-cyan)",
                        fontSize: "0.78rem",
                      }}
                    >
                      {(review.user?.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "#e8e8ff",
                        }}
                      >
                        {review.user?.name || "Anonymous"}
                      </p>
                      <p
                        style={{
                          color: "var(--color-text-dim)",
                          fontSize: "0.7rem",
                        }}
                      >
                        {review.user?.email}
                      </p>
                    </div>
                    {/* Approval badge */}
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.12rem 0.5rem",
                        borderRadius: "99px",
                        fontSize: "0.66rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        background: review.isApproved
                          ? "rgba(57,255,20,0.08)"
                          : "rgba(255,200,0,0.1)",
                        color: review.isApproved ? "#39ff14" : "#ffcc00",
                        border: `1px solid ${review.isApproved ? "rgba(57,255,20,0.25)" : "rgba(255,200,0,0.3)"}`,
                      }}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  {/* Product */}
                  <p
                    style={{
                      color: "var(--color-neon-cyan)",
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      marginBottom: "0.35rem",
                    }}
                  >
                    {review.product?.name || "Product"}
                  </p>

                  {/* Stars */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.15rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} filled={i <= (review.rating || 0)} />
                    ))}
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.82rem",
                        lineHeight: 1.55,
                        fontStyle: "italic",
                      }}
                    >
                      "{review.comment}"
                    </p>
                  )}
                  <p
                    style={{
                      color: "var(--color-text-dim)",
                      fontSize: "0.72rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {!review.isApproved && (
                    <button
                      type="button"
                      onClick={() => handleApprove(review._id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.35rem 0.7rem",
                        background: "rgba(57,255,20,0.08)",
                        border: "1px solid rgba(57,255,20,0.25)",
                        color: "#39ff14",
                        borderRadius: "7px",
                        cursor: "pointer",
                        fontSize: "0.73rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <CheckIcon /> Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(review._id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.35rem 0.7rem",
                      background: "rgba(255,50,50,0.08)",
                      border: "1px solid rgba(255,50,50,0.2)",
                      color: "#ff5555",
                      borderRadius: "7px",
                      cursor: "pointer",
                      fontSize: "0.73rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Reviews;
