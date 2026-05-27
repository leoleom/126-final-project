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
  tags = [],
  likes = 0,
  likedByUser,
  bookmarkedByUser,
  views = 0,
  onLike,
  onBookmark,
  onRequestReport,
  onReport,
  onView,
  onDelete,
  isDraft = false,
  showViews = true,
  showLikes = true,
  showComments = true,
  authorId,
  user,
  comments = 0,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <article className="relative rounded-[1.25rem] border border-[#d4ddd6] bg-[#f8fbf8]/95 px-6 py-5 shadow-sm transition hover:shadow-[0_12px_28px_rgba(63,111,79,0.08)]">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-3">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={username}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#d1d5db]" />
          )}

          <div>
            <p className="text-sm font-extrabold text-[#111827]">
              {username}
            </p>

            <p className="mt-0.5 text-xs font-semibold text-[#9ca3af]">
              {time}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg px-2 text-xl font-bold text-[#6b7280] transition hover:bg-[#f3f7f4] hover:text-[#3F6F4F]"
          >
            ⋯
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-xl border border-[#d4ddd6] bg-white shadow-[0_12px_28px_rgba(63,111,79,0.12)]">
              {user?.id === authorId ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/posts/${id}/edit`);
                      setShowMenu(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#26322B] hover:bg-[#f3f7f4]"
                  >
                    Edit Post
                  </button>

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      Delete Draft
                    </button>
                  )}
                </>
              ) : (
              <button
                type="button"
                onClick={() => {
                  onRequestReport?.(id);
                  setShowMenu(false);
                }}
                className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Report
              </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isDraft ? (
        <div onClick={onView} className="cursor-pointer">
          <h3 className="mt-5 text-xl font-extrabold text-[#1f2937] transition hover:text-[#3f6f4f]">
            {title}
          </h3>

          <div
            className="mt-3 max-w-[680px] text-sm leading-6 text-[#374151] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      ) : (
        <Link to={`/post/${id}`} className="block">
          <h3 className="mt-5 text-xl font-extrabold text-[#1f2937] transition hover:text-[#3f6f4f]">
            {title}
          </h3>

          <div
            className="mt-3 max-w-[680px] text-sm leading-6 text-[#374151] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Link>
      )}

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#e6f0ea] px-4 py-1 text-xs font-extrabold text-[#3f6f4f]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className={`mt-5 flex text-sm font-bold text-[#9ca3af] ${
          !showLikes && !showViews && !showComments
            ? "justify-end"
            : "items-center justify-between"
        }`}
      >
        {(showLikes || showViews || showComments) && (
          <div className="flex items-center gap-8">
            {showLikes && (
              <button
                type="button"
                onClick={onLike}
                className={`flex items-center gap-2 transition hover:text-red-500 ${
                  likedByUser ? "text-red-500" : "text-[#6b7280]"
                }`}
              >
                ♥ {likes} likes
              </button>
            )}

            {showViews && <span>{views} views</span>}

            {showComments && <span>{comments} comments</span>}
          </div>
        )}

        <button
          type="button"
          onClick={onBookmark}
          className={`transition hover:text-[#3f6f4f] ${
            bookmarkedByUser ? "text-[#3f6f4f]" : "text-[#9ca3af]"
          }`}
        >
          <Bookmark
            size={19}
            fill={bookmarkedByUser ? "currentColor" : "none"}
          />
        </button>
      </div>
    </article>
  );
}

export default PostCard;