import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bookmark } from "lucide-react";

function PostCard({
  id,
  username,
  profilePicture,
  time,
  title,
  body,
  tags,
  likes,
  likedByUser,
  views,
  onLike,
  onView,
  isDraft = false,
  authorId,
  user
}) {
  // Controls the visibility of the Edit/Report dropdown menu
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <article className="relative rounded-xl border border-[#e5e7eb] bg-white p-7 shadow-sm">
      
      {/* Post header: user info + action menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {profilePicture ? (
            <img src={profilePicture} alt={username} className="h-11 w-11 rounded-full object-cover" />
          ) : ( 
            <div className="h-11 w-11 rounded-full bg-[#d1d5db]" />
          )}

          {/* Username and timestamp */}
          <div>
            <p className="text-sm font-extrabold text-[#111827]">
              {username}
            </p>

            <p className="mt-1 text-xs font-semibold text-[#9ca3af]">
              {time}
            </p>
          </div>
        </div>

        {/* Post action dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="text-xl font-bold text-[#6b7280]"
          >
            ⋯
          </button>

          {/* Dropdown menu appears when toggled */}
          {showMenu && (
            <div className="absolute right-0 top-8 w-36 rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
              {user?.id === authorId ? (
                <button
                  onClick={() => navigate(`/posts/${id}/edit`)}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-[#f3f4f6]"
                >
                  Edit Post
                </button>
              ) : (
                <button className="block w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-[#f3f4f6]">
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Draft posts stay local and do not route to expanded post */}
      {isDraft ? (
        <div onClick={onView} className="cursor-pointer">
          <h3 className="mt-7 text-2xl font-extrabold text-[#1f2937] hover:text-[#3f6f4f]">
            {title}
          </h3>

          <div
            className="mt-4 max-w-[620px] text-sm leading-6 text-[#374151] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      ) : (
        /* Published posts route to expanded post page */
        <Link to={`/post/${id}`} onClick={onView}>
          <h3 className="mt-7 text-2xl font-extrabold text-[#1f2937] hover:text-[#3f6f4f]">
            {title}
          </h3>

          <div
            className="mt-4 max-w-[620px] text-sm leading-6 text-[#374151] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Link>
      )}

      {/* Post tags */}
      <div className="mt-7 flex flex-wrap gap-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#e6f0ea] px-5 py-1.5 text-xs font-extrabold text-[#3f6f4f]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Post engagement metrics */}
      <div className="mt-6 flex gap-12 text-sm font-bold text-[#9ca3af]">
        
        {/* Like button */}
        <button
          type="button"
          onClick={onLike}
          className={`flex items-center gap-2 ${
            likedByUser
              ? "text-red-500"
              : "text-[#6b7280]"
          }`}
        >
          ♥ {likes} likes
        </button>

        {/* View counter */}
        <span>{views} views</span>

        <span><Bookmark size={20} /></span>
      </div>
    </article>
  );
}

export default PostCard;