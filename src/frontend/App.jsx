import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Guidelines from "./pages/guidelines";
import Feed from "./pages/feed";
import CreatePost from "./pages/users/createPost";
import ExpandedPost from "./pages/expandedPost";
import EditDraft from "./pages/users/editDraft";

import Settings from "./pages/settings";
import Profile from "./pages/profile";
import Bookmarks from "./pages/users/bookmarks";
import Drafts from "./pages/users/drafts";
import Privacy from "./pages/users/privacy";
import Notifications from "./pages/users/notifications";
import ChangePassword from "./pages/users/changePassword";
import ForgotPassword from "./pages/forgotPassword";

import ProtectedRoute from "./components/protectedRoute";
import AdminRoute from "./components/adminRoute";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminUsers from "./pages/admin/adminUsers";
import AdminReportedPosts from "./pages/admin/adminReportedPosts";
import AdminAnonPosts from "./pages/admin/adminAnonPosts";
import AdminSettings from "./pages/admin/adminSettings";

import { useAuth } from "./utils/authUtils";

function App() {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center font-bold">
        Initializing Freedom Wall...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/login"
          element={
            authReady && user
              ? <Navigate to="/feed" replace />
              : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            authReady && user
              ? <Navigate to="/feed" replace />
              : <Signup />
          }
        />

        {/* Protected user routes */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Feed user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <CreatePost user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <ExpandedPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Settings user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Bookmarks user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Drafts user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/privacy"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Privacy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/notifications"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/change-password"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts/:id/edit"
          element={
            <ProtectedRoute user={user} authReady={authReady}>
              <EditDraft user={user} />
            </ProtectedRoute>
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={<AdminRoute user={user}><AdminDashboard /></AdminRoute>}
        />
        <Route
          path="/admin/users"
          element={<AdminRoute user={user}><AdminUsers /></AdminRoute>}
        />
        <Route
          path="/admin/reported-posts"
          element={<AdminRoute user={user}><AdminReportedPosts /></AdminRoute>}
        />
        <Route
          path="/admin/anonymous-posts"
          element={<AdminRoute user={user}><AdminAnonPosts /></AdminRoute>}
        />
        <Route
          path="/admin/settings"
          element={<AdminRoute user={user}><AdminSettings /></AdminRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
