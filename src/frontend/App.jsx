import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../../src/frontend/pages/home";
import Login from "../../src/frontend/pages/login";
import Signup from "../../src/frontend/pages/signup";
import Guidelines from "./pages/guidelines";
import Feed from "./pages/feed";
import CreatePost from "./pages/users/createPost";
import ExpandedPost from "./pages/expandedPost";

import Settings from "./pages/settings";
import Profile from "./pages/profile";
import Bookmarks from "./pages/users/bookmarks";
import Drafts from "./pages/users/drafts";
import Privacy from "./pages/users/privacy";
import Notifications from "./pages/users/notifications";
import ChangePassword from "./pages/users/changePassword";
import ForgotPassword from "./pages/forgotPassword";

import AdminRoute from "./components/adminRoute";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminUsers from "./pages/admin/adminUsers";
import AdminReportedPosts from "./pages/admin/adminReportedPosts";
import AdminAnonPosts from "./pages/admin/adminAnonPosts";
import AdminSettings from "./pages/admin/adminSettings";


function App() {
  // Temporary test user.
  // Change role to "user" to test non-admin view.
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />

        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/feed" element={<Feed user={user} />} />
        <Route path="/create-post" element={<CreatePost user={user} />} />
        <Route path="/post/:id" element={<ExpandedPost />} />
        <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/bookmarks" element={<Bookmarks user={user} />} />
        <Route path="/drafts" element={<Drafts user={user} />} />

        <Route path="/settings/privacy" element={<Privacy setUser={setUser} />} />
        <Route path="/settings/notifications" element={<Notifications setUser={setUser} />} />
        <Route path="/settings/change-password" element={<ChangePassword setUser={setUser} />} />

        <Route path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          } />

        <Route path="/admin/users"
          element={
            <AdminRoute user={user}>
              <AdminUsers />
            </AdminRoute>
          }  />

        <Route path="/admin/reported-posts"
          element={
            <AdminRoute user={user}>
              <AdminReportedPosts />
            </AdminRoute>
          }  />

        <Route path="/admin/anonymous-posts"
          element={
            <AdminRoute user={user}>
              <AdminAnonPosts />
            </AdminRoute>
          } />

        <Route path="/admin/settings"
          element={
            <AdminRoute user={user}>
              <AdminSettings />
            </AdminRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;