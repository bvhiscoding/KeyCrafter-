import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/store/auth.slice";
import { useLoginMutation } from "@/features/auth/auth.api";

const KeyIcon = () => (
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
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginApi] = useLoginMutation();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await loginApi({ email, password }).unwrap();
      
      const { user, accessToken, refreshToken } = response.data;
      dispatch(setCredentials({ token: accessToken, refreshToken, user }));
      navigate(location.state?.from || "/");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Header */}
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
            <KeyIcon />
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
            Access Terminal
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
            Enter credentials to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              htmlFor="login-email"
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
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
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
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="button button-primary button-block"
            style={{
              padding: "0.85rem",
              fontSize: "0.88rem",
              marginTop: "0.25rem",
            }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Authenticating..." : "Login →"}
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
          No account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--color-neon-cyan)", fontWeight: 600 }}
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
