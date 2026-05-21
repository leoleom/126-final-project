import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, authReady }) => {
  if (!authReady) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;