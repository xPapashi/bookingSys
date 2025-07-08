import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function PublicRoute({ children }) {
  const { token } = useContext(AuthContext);
  return !token ? children : <Navigate to="/dashboard" replace />;
}
