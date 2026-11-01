
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await login(form);

      navigate("/", { replace: true });

    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-logo">
          <i className="bi bi-shield-check"></i>
          FORGE
        </div>
        <p>Your gateway to simpler government services.</p>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to FORGE</h2>
          <p>Enter your credentials to access your account.</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <i className="bi bi-arrow-right ms-2"></i>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register"> Create Account</Link>
        </div>
      </div>

      <p className="auth-bottom-text">
        Secure access to your personal government services vault.
      </p>
    </div>
  );
};

export default Login;
