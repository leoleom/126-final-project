import { Link, useLocation, useNavigate } from "react-router-dom";

function SettingsNavbar({ setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  // --- SKELETON ACTION LISTENERS ---

  const handleNavClick = (label) => {
    console.log(`Settings Nav item clicked: ${label}`);
  };

  function handleLogout(e) {
    e.preventDefault();

    console.log("Logout button clicked");

    // Existing logic
    setUser(null);
    navigate("/");
  }

  const settingsItems = [
    { label: "Home", path: "/feed" },
    { label: "Account", path: "/settings" },
    { label: "Privacy", path: "/settings/privacy" },
    { label: "Notifications", path: "/settings/notifications" },
    { label: "Change Password", path: "/settings/change-password" },
  ];

  return (
    <aside className="border-r border-[#e5e7eb] px-8 py-10">
      <h1 className="text-xl font-extrabold text-[#3f6f4f]">
        Better Better UPV
      </h1>

      <nav className="mt-14 space-y-4 text-sm font-extrabold">
        {settingsItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => handleNavClick(item.label)} // Added listener
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

      <button
        type="button"
        onClick={handleLogout} // Listener already attached, but now logs and prevents default
        className="mt-44 block px-6 text-sm font-extrabold"
      >
        Logout
      </button>
    </aside>
  );
}

export default SettingsNavbar;