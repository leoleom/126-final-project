import { Link } from "react-router-dom";
import { useState } from "react";

function PostCard({
  id,
  username,
  time,
  title,
  body,
  tags,
  likes,
  views,
  onLike,
  onView,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <article className="relative rounded-xl border border-[#e5e7eb] bg-white p-7">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-[#d1d5db]" />

          <div>
            <p className="text-sm font-extrabold text-[#111827]">
              {username}
            </p>

            <p className="mt-1 text-xs font-semibold text-[#9ca3af]">
              {time}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-xl font-bold text-[#6b7280]"
          >
            ⋯
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-36 rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
              <button className="block w-full px-4 py-3 text-left text-sm hover:bg-[#f3f4f6]">
                Edit
              </button>

              <button className="block w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-[#f3f4f6]">
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      <Link to={`/post/${id}`} onClick={onView}>
        <h3 className="mt-7 text-2xl font-extrabold text-[#1f2937] hover:text-[#3f6f4f]">
          {title}
        </h3>

        <p className="mt-4 max-w-[620px] text-sm leading-6 text-[#374151]">
          {body}
        </p>
      </Link>

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

      <div className="mt-6 flex gap-12 text-sm font-bold text-[#9ca3af]">
        <button
          type="button"
          onClick={onLike}
          className="font-bold hover:text-[#3f6f4f]"
        >
          ♥ {likes} likes
        </button>

        <span> 👁 {views} views</span>
      </div>
    </article>
  );
}

export default PostCard;