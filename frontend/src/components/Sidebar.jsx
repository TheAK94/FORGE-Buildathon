
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <i className="bi bi-layers"></i>
        <span>FORGE</span>
      </div>

      <p className="sidebar-label">WORKSPACE</p>

      <NavLink to="/" className="nav-item">
        <i className="bi bi-grid"></i>
        Dashboard
      </NavLink>

      <NavLink to="/new-request" className="nav-item">
        <i className="bi bi-stars"></i>
        New Request
      </NavLink>

      <NavLink to="/profile" className="nav-item">
        <i className="bi bi-person"></i>
        My Profile
      </NavLink>

      <NavLink to="/documents" className="nav-item">
        <i className="bi bi-folder2"></i>
        Document Vault
      </NavLink>

      <div className="sidebar-bottom">
        <div className="user-avatar">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="account-info">
          <strong>My Account</strong>
          <small>{user?.email || "Personal Workspace"}</small>
        </div>
      </div>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
