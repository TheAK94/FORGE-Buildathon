
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
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

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        email: form.email,
        password: form.password
      });

      navigate("/", { replace: true });

    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed."
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
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p>Join FORGE and manage your government documents in one place.</p>
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

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                id="showPassword"
              />
              <label className="form-check-label" htmlFor="showPassword">
                Show password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <i className="bi bi-arrow-right ms-2"></i>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login"> Sign In</Link>
        </div>
      </div>

      <p className="auth-bottom-text">
        Your information stays protected within your personal vault.
      </p>
    </div>
  );
};

export default Register;
