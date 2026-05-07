import { Link } from "react-router-dom";

function CreatePost() {
  return (
    <div className="min-h-screen bg-[#f7f8f7] px-10 py-10 text-[#1f2937]">
      <main className="mx-auto max-w-[980px] rounded-xl bg-white px-16 py-12">
        <header className="flex items-center justify-between">
          <Link to="/feed" className="text-sm font-extrabold text-[#374151]">
            ← Back
          </Link>

          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" />
            Post anonymously
          </label>

          <div className="flex gap-6">
            <Link
              to="/feed"
              className="flex h-11 w-28 items-center justify-center rounded-lg border border-[#e5e7eb] text-sm font-extrabold"
            >
              Cancel
            </Link>

            <button className="h-11 w-28 rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white">
              Publish
            </button>
          </div>
        </header>

        <section className="mt-16">
          <label className="text-sm font-extrabold">Post Title</label>
          <input
            type="text"
            placeholder="Write your title here..."
            className="mt-3 h-12 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </section>

        <section className="mt-10">
          <label className="text-sm font-extrabold">Tags</label>

          <div className="mt-4 flex gap-6">
            {["academics", "students", "rant"].map((tag) => (
              <span
                key={tag}
                className="flex h-8 w-40 items-center justify-between rounded-lg bg-[#e6f0ea] px-4 text-xs font-bold text-[#3f6f4f]"
              >
                {tag}
                <button>x</button>
              </span>
            ))}

            <button className="text-lg font-bold text-[#3f6f4f]">+</button>
          </div>
        </section>

        <section className="mt-10">
          <label className="text-sm font-extrabold">Write your post...</label>

          <textarea
            placeholder="Share your thoughts..."
            className="mt-3 h-56 w-full resize-none rounded-lg border border-[#e5e7eb] p-6 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </section>

        <section className="mt-10">
          <label className="text-sm font-extrabold">
            Add images (optional)
          </label>

          <div className="mt-4 grid grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <button
                key={item}
                className="h-40 rounded-lg bg-[#e6f0ea] text-sm font-semibold text-[#6b7280]"
              >
                Upload image
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CreatePost;
