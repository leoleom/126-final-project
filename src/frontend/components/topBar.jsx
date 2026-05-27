import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

function TopBar({ user, searchQuery, setSearchQuery }) {
  return (
    <header className="flex h-24 items-center justify-between border-b border-[#cfd8d1] bg-[#e6ece7]/85 px-6 backdrop-blur-xl xl:px-9">
      {/* Search */}
      <div className="flex h-12 w-full max-w-[560px] items-center rounded-2xl border border-[#d4ddd6] bg-[#eef3ef] px-4 shadow-sm transition focus-within:border-[#3F6F4F] focus-within:shadow-[0_8px_20px_rgba(63,111,79,0.10)]">
        <Search size={18} className="text-[#6b756d]" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, tags, or topics"
          className="ml-3 h-full flex-1 bg-transparent text-sm font-medium text-[#26322B] outline-none placeholder:text-[#8F9892]"
        />
      </div>

      {/* Profile */}
      <Link
        to="/profile"
        className="ml-6 flex shrink-0 items-center gap-3 rounded-2xl border border-transparent px-3 py-2 transition hover:border-[#d4ddd6] hover:bg-[#eef3ef]"
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username || "Profile"}
            className="h-11 w-11 rounded-full border border-[#d4ddd6] object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4ddd6] bg-[#dfe8e2] shadow-sm">
            <User size={18} className="text-[#5F6B63]" />
          </div>
        )}

        <div className="hidden flex-col text-right sm:flex">
          <span className="text-xs font-semibold text-[#8B968F]">
            Signed in as
          </span>

          <span className="text-sm font-extrabold text-[#26322B]">
            {user?.username ? `@${user.username}` : "Profile"}
          </span>
        </div>
      </Link>
    </header>
  );
}

export default TopBar;