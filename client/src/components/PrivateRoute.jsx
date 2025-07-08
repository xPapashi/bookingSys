import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function PrivateRoute({ children, requireAdmin = false }) {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
