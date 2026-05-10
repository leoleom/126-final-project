import { Link } from "react-router-dom";

function TopBar({ user, searchQuery, setSearchQuery }) {
  return (
    <header className="flex h-28 items-center justify-between border-b border-[#e5e7eb] px-9">
      <div className="flex h-12 w-[480px] items-center rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#6b7280]">
        <span>🔍</span>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, tags, or topics"
          className="ml-3 h-full flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <Link to="/profile" className="flex items-center gap-4">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="h-11 w-11 rounded-full bg-[#d1d5db]" />
        )}
        <span className="text-sm font-extrabold">@{user?.username}</span>
      </Link>
    </header>
  );
}

export default TopBar;
