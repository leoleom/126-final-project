import { Link, useLocation } from "react-router-dom";

function AdminNavbar() {
  const location = useLocation();

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

      <Link
        to="/"
        className="mt-40 block px-6 text-sm font-extrabold"
      >
        Logout
      </Link>
    </aside>
  );
}

export default AdminNavbar;