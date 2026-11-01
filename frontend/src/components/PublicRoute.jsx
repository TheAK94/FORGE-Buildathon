import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Checking session...</div>;
  }

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;