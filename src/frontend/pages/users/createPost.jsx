import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import { getTags } from "../../services/tagService";

function CreatePost({ user }) {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function loadTags() {
      const data = await getTags();
      setTags(data);
    }

    loadTags();
  }, []);

  function handleTagToggle(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(
        selectedTags.filter((item) => item !== tag)
      );
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function handleSubmit() {
    if (!content.trim()) return;

    const newPost = {
      content,
      isAnonymous,
      tags: selectedTags,
      username: isAnonymous
        ? "Anonymous user"
        : user?.username,
      createdAt: new Date().toISOString(),
    };

    console.log("Post submitted:", newPost);

    setContent("");
    setIsAnonymous(false);
    setSelectedTags([]);

    navigate("/feed");
  }

  const isSubmitDisabled = content.trim() === "";

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <Navbar user={user} />

        <div className="grid grid-rows-[112px_1fr]">

          <main className="px-9 py-10">
            <h1 className="text-3xl font-extrabold">
              Create Post
            </h1>

            <section className="mt-8 max-w-[760px] rounded-xl border border-[#e5e7eb] bg-white p-7">
              <label className="text-sm font-extrabold text-[#111827]">
                What do you want to share?
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post here..."
                className="mt-3 min-h-[180px] w-full rounded-lg border border-[#e5e7eb] px-4 py-3 text-sm outline-none focus:border-[#3f6f4f]"
              />

              <label className="mt-6 flex items-center justify-between rounded-lg border border-[#e5e7eb] px-4 py-4 text-sm font-bold">
                Post anonymously

                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) =>
                    setIsAnonymous(e.target.checked)
                  }
                />
              </label>

              <div className="mt-6">
                <p className="text-sm font-extrabold text-[#111827]">
                  Tags
                </p>

                <p className="mt-1 text-xs text-[#6b7280]">
                  Optional. Select one or more tags.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {tags.map((tag) => {
                    const isSelected =
                      selectedTags.includes(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          handleTagToggle(tag)
                        }
                        className={`rounded-full px-5 py-2 text-xs font-extrabold ${
                          isSelected
                            ? "bg-[#3f6f4f] text-white"
                            : "bg-[#e6f0ea] text-[#3f6f4f]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
                className={`mt-8 h-11 w-full rounded-lg text-sm font-extrabold ${
                  isSubmitDisabled
                    ? "cursor-not-allowed bg-[#d1d5db] text-white"
                    : "bg-[#3f6f4f] text-white"
                }`}
              >
                Submit Post
              </button>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
