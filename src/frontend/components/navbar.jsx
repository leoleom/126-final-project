import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  Home,
  User,
  Bookmark,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
  PlusSquare,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

function Navbar({ user, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {alert("Logout failed.");return;}

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
      ? [{ label: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> }]
      : []),
  ];

  return (
    <aside className="border-r border-[#e5e7eb] px-6 py-10">
      <div className="flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-lg font-extrabold text-[#3f6f4f]">
            Better Better UPV
          </h1>
        )}

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#3f6f4f]"
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      <Link
        to="/create-post"
        className={`mt-16 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white hover:bg-[#355d42] ${
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
              className={`flex h-12 items-center gap-3 rounded-lg transition ${
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
        onClick={handleLogout}
        className={`mt-24 flex h-12 items-center gap-3 text-sm font-extrabold text-[#111827] hover:text-red-500 cursor-pointer ${
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

export default Navbar;