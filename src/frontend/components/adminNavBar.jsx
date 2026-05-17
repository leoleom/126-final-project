import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  Home,
  LayoutDashboard,
  Users,
  MessageSquareWarning,
  Flag,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function AdminNavbar({ user, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {alert("Logout failed.");return;}

    navigate("/");
  }

  const adminItems = [
    {
      label: "Overview",
      path: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
    {
      label: "Review Anonymous Posts",
      path: "/admin/anonymous-posts",
      icon: <MessageSquareWarning size={18} />,
    },
    {
      label: "Reported Posts",
      path: "/admin/reported-posts",
      icon: <Flag size={18} />,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: <Settings size={18} />,
    },
  ];


  return (
    <aside className="border-r border-[#e5e7eb] px-6 py-10">
      <div className="flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-2xl font-extrabold text-[#3f6f4f]">
            Admin
          </h1>
        )}

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#3f6f4f]"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>
      </div>

      <Link
        to="/feed"
        className={`mt-8 flex h-12 items-center gap-3 rounded-lg text-sm font-extrabold text-[#111827] transition hover:bg-[#f9fafb] ${
          sidebarOpen ? "px-5" : "justify-center px-0"
        }`}
        title="Home"
      >
        <Home size={18} />
        {sidebarOpen && <span>Home</span>}
      </Link>

      <nav className="mt-8 space-y-3 text-sm font-extrabold">
        {adminItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              title={item.label}
              className={`flex min-h-12 items-center gap-3 rounded-lg transition ${
                sidebarOpen ? "px-5" : "justify-center px-0"
              } ${
                isActive
                  ? "bg-[#e6f0ea] text-[#3f6f4f]"
                  : "text-[#111827] hover:bg-[#f9fafb]"
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
        onClick={handleLogout}
        className={`mt-24 flex h-12 items-center gap-3 text-sm font-extrabold text-[#111827] transition hover:text-red-500 ${
          sidebarOpen ? "px-5" : "w-12 justify-center"
        }`}
        title="Logout"
      >
        <LogOut size={18} />
        {sidebarOpen && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default AdminNavbar;