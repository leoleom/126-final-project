import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import ConfirmDialog from "./confirmDialog";
import {
  Home, User, Bookmark, FileText, ShieldCheck, Settings,
  LogOut, PlusSquare, LayoutDashboard, PanelLeftClose, PanelLeftOpen,} from "lucide-react";

function Navbar({ user, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed.");
      return;
    }

    toast.success("Logged out successfully.");
    navigate("/");
  }

  const navItems = [
    { label: "Home", path: "/feed", icon: <Home size={18} /> },
    { label: "Profile", path: "/profile", icon: <User size={18} /> },
    { label: "Bookmarks", path: "/bookmarks", icon: <Bookmark size={18} /> },
    { label: "Drafts", path: "/drafts", icon: <FileText size={18} /> },
    { label: "Guidelines", path: "/guidelines", icon: <ShieldCheck size={18} /> },
    { label: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ...(user?.role === "admin"
      ? [
          {
            label: "Admin Dashboard",
            path: "/admin",
            icon: <LayoutDashboard size={18} />,
          },
        ]
      : []),
  ];

  return (
    <aside className="border-r border-[#cfd8d1] bg-[#e6ece7]/90 px-6 py-10 shadow-[8px_0_30px_rgba(63,111,79,0.06)]">
      <div className="flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-lg font-extrabold leading-tight text-[#3F6F4F]">
            Better Better UPV
          </h1>
        )}

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5F6B63] transition hover:bg-[#dfe8e2] hover:text-[#3F6F4F]"
        >
          {sidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>
      </div>

      <Link
        to="/create-post"
        className={`mt-16 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#3F6F4F] text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] ${
          sidebarOpen ? "w-full" : "w-12"
        }`}
        title="Create Post"
      >
        <PlusSquare size={18} />
        {sidebarOpen && <span>Create Post</span>}
      </Link>

      <nav className="mt-8 space-y-3 text-sm font-extrabold">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              title={item.label}
              className={`flex h-12 items-center gap-3 rounded-xl transition ${
                sidebarOpen ? "px-5" : "justify-center px-0"
              } ${
                isActive
                  ? "bg-[#dfe8e2] text-[#3F6F4F] shadow-sm"
                  : "text-[#1f2937] hover:bg-[#edf2ee] hover:text-[#3F6F4F]"
              }`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setShowLogoutConfirm(true)}
        className={`mt-24 flex h-12 items-center gap-3 rounded-xl text-sm font-extrabold text-[#1f2937] transition hover:bg-[#f7eaea] hover:text-red-500 ${
          sidebarOpen ? "px-5" : "w-12 justify-center"
        }`}
        title="Logout"
      >
        <LogOut size={18} />
        {sidebarOpen && <span>Logout</span>}
      </button>
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        message="You will be returned to the landing page."
        confirmText="Log out"
        cancelText="Cancel"
        danger
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </aside>
  );
}

export default Navbar;