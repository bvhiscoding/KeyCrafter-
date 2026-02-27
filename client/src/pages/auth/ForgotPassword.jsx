import { useState } from "react";
import { Link } from "react-router-dom";

import { useForgotPasswordMutation } from "@/features/auth/authApi";

const MailIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devResetLink, setDevResetLink] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setDevResetLink("");

    try {
      const response = await forgotPassword({ email }).unwrap();
      setMessage(
        response?.message || "If this email exists, a reset link has been sent.",
      );

      const resetToken = response?.data?.resetToken;
      if (resetToken) {
        setDevResetLink(`/reset-password?token=${resetToken}`);
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "rgba(0,245,255,0.1)",
              border: "1px solid rgba(0,245,255,0.3)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "var(--color-neon-cyan)",
              boxShadow: "0 0 20px rgba(0,245,255,0.2)",
            }}
          >
            <MailIcon />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.4rem",
            }}
          >
            Reset Password
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
            Enter your email and we'll send a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              htmlFor="forgot-email"
              style={{
                display: "block",
                marginBottom: "0.4rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
              }}
            >
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          {message && (
            <p
              style={{
                padding: "0.65rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.83rem",
                background: "rgba(57,255,20,0.08)",
                border: "1px solid rgba(57,255,20,0.25)",
                color: "#39ff14",
              }}
            >
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              style={{
                padding: "0.65rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.83rem",
                background: "rgba(255,50,50,0.08)",
                border: "1px solid rgba(255,50,50,0.25)",
                color: "#ff5555",
              }}
            >
              {error}
            </p>
          )}

          {devResetLink && (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>
              Dev reset link: {" "}
              <Link
                to={devResetLink}
                style={{ color: "var(--color-neon-cyan)", fontWeight: 600 }}
              >
                Open reset page
              </Link>
            </p>
          )}

          <button
            type="submit"
            className="button button-primary button-block"
            style={{ padding: "0.85rem" }}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="neon-divider" style={{ margin: "1.5rem 0" }} />
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "0.85rem",
          }}
        >
          Remembered?{" "}
          <Link
            to="/login"
            style={{ color: "var(--color-neon-cyan)", fontWeight: 600 }}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
