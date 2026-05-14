import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, authReady, children }) {
  if (!authReady) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;