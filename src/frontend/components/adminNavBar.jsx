import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }
  
  const adminItems = [
    { label: "Overview", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Review Anonymous Posts", path: "/admin/anonymous-posts" },
    { label: "Reported Posts", path: "/admin/reported-posts" },
    { label: "Settings", path: "/admin/settings" },
  ];


  return (
    <aside className="border-r border-[#e5e7eb] px-8 py-10">
      <h1 className="text-2xl font-extrabold text-[#3f6f4f]">
        Admin
      </h1>

      <nav className="mt-10 space-y-4 text-sm font-extrabold">
        {adminItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex min-h-12 items-center rounded-lg px-6 ${
                isActive
                  ? "bg-[#e6f0ea] text-[#111827]"
                  : "text-[#111827]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="mt-28 block px-7 text-sm font-extrabold text-left text-[#111827] hover:text-red-500"
      >
        Logout
      </button>
    </aside>
  );
}

export default AdminNavbar;