import { Link, useLocation } from "react-router-dom";

function Navbar({user}) {
  const location = useLocation();

  const navItems = [
    { label: "🏠︎ Home", path: "/feed" },
    { label: " Profile", path: "/profile" },
    { label: "Bookmarks", path: "/bookmarks" },
    { label: "✉︎ Drafts", path: "/drafts" },
    { label: " Guidelines", path: "/guidelines" },
    { label: "Settings", path: "/settings" },

    ...(user?.role === "admin"
      ? [{ label: "Admin Dashboard", path: "/admin" }]
      : []),
  ];

  return (
    <aside className="border-r border-[#e5e7eb] px-9 py-10">
      <h1 className="text-xl font-extrabold text-[#3f6f4f]">
        Better Better UPV
      </h1>

      <Link
        to="/create-post"
        className="mt-16 flex h-14 w-full items-center justify-center rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white"
      >
        + Create Post
      </Link>

      <nav className="mt-8 space-y-3 text-sm font-extrabold">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex h-12 items-center rounded-lg px-7 ${
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

      <Link to="/" className="mt-28 block px-7 text-sm font-extrabold text-red-500">
        Logout
      </Link>
    </aside>
  );
}

export default Navbar;
