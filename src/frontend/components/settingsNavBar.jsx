import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Shield,
  Bell,
  KeyRound,
  LogOut,
} from "lucide-react";

function SettingsNavbar({ setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const settingsItems = [
    {
      label: "Home",
      path: "/feed",
      icon: <Home size={18} />,
    },
    {
      label: "Account",
      path: "/settings",
      icon: <User size={18} />,
    },
    {
      label: "Privacy",
      path: "/settings/privacy",
      icon: <Shield size={18} />,
    },
    {
      label: "Notifications",
      path: "/settings/notifications",
      icon: <Bell size={18} />,
    },
    {
      label: "Change Password",
      path: "/settings/change-password",
      icon: <KeyRound size={18} />,
    },
  ];

  function handleLogout() {
    setUser(null);
    navigate("/");
  }

  return (
    <aside className="border-r border-[#e5e7eb] px-8 py-10">
      {/* Logo */}
      <h1 className="text-xl font-extrabold text-[#3f6f4f]">
        Better Better UPV
      </h1>

      {/* Navigation */}
      <nav className="mt-14 space-y-3 text-sm font-extrabold">
        {settingsItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex min-h-12 items-center gap-3 rounded-lg px-6 transition ${
                isActive
                  ? "bg-[#e6f0ea] text-[#3f6f4f]"
                  : "text-[#111827] hover:bg-[#f9fafb]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-40 flex items-center gap-3 px-6 text-sm font-extrabold text-[#111827] transition hover:text-red-500"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default SettingsNavbar;