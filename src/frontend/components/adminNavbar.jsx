import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmDialog from "./confirmDialog";
import {
  Home, LayoutDashboard, Users, MessageSquareWarning,
  Flag, Settings, LogOut, PanelLeftClose, PanelLeftOpen,} from "lucide-react";

function AdminNavbar({ sidebarOpen, setSidebarOpen, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handleLogout() {
    setUser?.(null);
    toast.success("Logged out successfully.");
    navigate("/");
  }

  const adminItems = [
    { label: "Home", path: "/feed", icon: <Home size={18} /> },
    { label: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Users", path: "/admin/users", icon: <Users size={18} /> },
    {
      label: "Anonymous Posts",
      path: "/admin/anonymous-posts",
      icon: <MessageSquareWarning size={18} />,
    },
    {
      label: "Reported Posts",
      path: "/admin/reported-posts",
      icon: <Flag size={18} />,
    },
    { label: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      <aside className="flex min-h-screen flex-col border-r border-[#cfd8d1] bg-[#e6ece7]/90 px-6 py-10 shadow-[8px_0_30px_rgba(63,111,79,0.06)]">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-lg font-extrabold leading-tight text-[#3F6F4F]">
              Admin
            </h1>
          )}

          <button
            type="button"
            onClick={() => setSidebarOpen?.(!sidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5F6B63] transition hover:bg-[#dfe8e2] hover:text-[#3F6F4F]"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </button>
        </div>

        <nav className="mt-16 space-y-3 text-sm font-extrabold">
          {adminItems.map((item) => {
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
          className={`mt-auto flex h-12 items-center gap-3 rounded-xl text-sm font-extrabold text-[#1f2937] transition hover:bg-[#f7eaea] hover:text-red-500 ${
            sidebarOpen ? "px-5" : "w-12 justify-center"
          }`}
          title="Logout"
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

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
    </>
  );
}

export default AdminNavbar;