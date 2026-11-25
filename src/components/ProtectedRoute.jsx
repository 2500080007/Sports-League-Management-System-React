import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}