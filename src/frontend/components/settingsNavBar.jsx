import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "./confirmDialog";
import { supabase } from "../services/supabaseClient";
import {Home, User, Shield, Bell, KeyRound, LogOut, PanelLeftClose, PanelLeftOpen,} from "lucide-react";

function SettingsNavbar({ setUser, sidebarOpen = true, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const settingsItems = [
    { label: "Home", path: "/feed", icon: <Home size={18} /> },
    { label: "Account", path: "/settings", icon: <User size={18} /> },
    { label: "Privacy", path: "/settings/privacy", icon: <Shield size={18} /> },
    { label: "Notifications", path: "/settings/notifications", icon: <Bell size={18} /> },
    { label: "Change Password", path: "/settings/change-password", icon: <KeyRound size={18} /> },
  ];

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed.");
      return;
    }

    toast.success("Logged out successfully.");
    navigate("/");
  }

  return (
    <>
      <aside className="flex min-h-screen flex-col border-r border-[#cfd8d1] bg-[#e6ece7]/90 px-6 py-10 shadow-[8px_0_30px_rgba(63,111,79,0.06)]">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-lg font-extrabold leading-tight text-[#3F6F4F]">
              Better Better UPV
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

        <nav className="mt-14 space-y-3 text-sm font-extrabold">
          {settingsItems.map((item) => {
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

export default SettingsNavbar;