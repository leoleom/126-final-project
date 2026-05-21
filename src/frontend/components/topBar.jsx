import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

function TopBar({ user, searchQuery, setSearchQuery }) {
  return (
    <header className="flex h-24 items-center justify-between border-b border-[#e5e7eb] px-9">
      {/* Search */}
      <div className="flex h-9 w-full max-w-[520px] items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 transition focus-within:border-[#3f6f4f] focus-within:bg-white">
        <Search size={18} className="text-[#6b7280]" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, tags, or topics"
          className="ml-3 h-full flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Profile */}
      <Link
        to="/profile"
        className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-[#f9fafb]"
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username || "Profile"}
            className="h-11 w-11 rounded-full object-cover border border-[#e5e7eb]"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-[#f3f4f6]">
            <User size={18} className="text-[#6b7280]" />
          </div>
        )}

        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold text-[#9ca3af]">
            Signed in as
          </span>

          <span className="text-sm font-extrabold text-[#111827]">
            {user?.username ? `@${user.username}` : "Profile"}
          </span>
        </div>
      </Link>
    </header>
  );
}

export default TopBar;