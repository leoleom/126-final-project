import { Link, useParams } from "react-router-dom";

function ExpandedPost() {
  const { id } = useParams();

  const posts = [
    {
      id: 1,
      username: "@leolem",
      time: "2h ago",
      title: "Lf: kasama habang buhay",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor ultricies metus, a rhoncus felis convallis commodo. Proin at mauris et odio scelerisque ultrices in turpis.",
      tags: ["mental health", "academics", "students", "+2"],
      likes: 51,
      views: 120,
    },
    {
      id: 2,
      username: "@junel",
      time: "8h ago",
      title: "Iniwan mo nako sa ere :(",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor ultricies metus, a rhoncus felis convallis commodo. Proin at mauris et odio scelerisque ultrices in turpis.",
      tags: ["rants", "relationships", "students"],
      likes: 28,
      views: 89,
    },
  ];

  const post = posts.find((item) => item.id === Number(id));

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f7] text-[#1f2937]">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Post not found.</h1>
          <Link
            to="/feed"
            className="mt-4 inline-block text-sm font-bold text-[#3f6f4f]"
          >
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] px-10 py-10 text-[#1f2937]">
      <main className="mx-auto grid max-w-[1100px] grid-cols-[1fr_260px] gap-10">
        <section>
          <Link to="/feed" className="text-sm font-extrabold text-[#374151]">
            ← Back to all posts
          </Link>

          <article className="mt-8 rounded-xl border border-[#e5e7eb] bg-white p-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#d1d5db]" />

              <div>
                <p className="text-sm font-extrabold">{post.username}</p>
                <p className="text-xs font-semibold text-[#9ca3af]">
                  {post.time}
                </p>
              </div>
            </div>

            <h1 className="mt-8 text-2xl font-extrabold">{post.title}</h1>

            <div className="mt-6 flex flex-wrap gap-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[#e6f0ea] px-6 py-2 text-xs font-bold text-[#3f6f4f]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm leading-6 text-[#374151]">
              {post.body}
            </p>

            <div className="mt-6 flex gap-6 text-sm font-bold">
              <span>{post.likes} Likes</span>
              <span>{post.views} Views</span>
            </div>
          </article>

          <section className="mt-8 rounded-xl border border-[#e5e7eb] bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Comments (14)</h2>

              <button className="rounded-lg border border-[#e5e7eb] px-5 py-3 text-sm font-bold">
                Most recent ˅
              </button>
            </div>

            <div className="mt-8 space-y-8">
              <Comment username="@marites1" />
              <Comment username="@iskolarngbayan" />
            </div>
          </section>
        </section>

        <aside className="space-y-8 pt-12">
          <section className="rounded-lg bg-[#e6f0ea] p-7">
            <h3 className="text-lg font-extrabold">About the author</h3>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#d1d5db]" />

              <div>
                <p className="text-sm font-extrabold">{post.username}</p>
                <p className="text-xs">Joined March 2026</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm font-bold">27 Posts</p>
          </section>

          <section className="rounded-lg bg-[#e6f0ea] p-7">
            <h3 className="text-lg font-extrabold">Related Posts</h3>

            <ul className="mt-8 space-y-10 text-sm">
              <li>How to deal with failures</li>
              <li>An open letter to my prof</li>
              <li>Group works: blessing or curse?</li>
            </ul>

            <Link
              to="/feed"
              className="mt-8 block text-sm font-extrabold text-[#3f6f4f]"
            >
              View all
            </Link>
          </section>
        </aside>
      </main>
    </div>
  );
}

function Comment({ username }) {
  return (
    <article className="border-l-4 border-[#1f2937] pl-5">
      <p className="text-sm font-bold">{username}</p>

      <p className="mt-2 text-sm leading-6 text-[#374151]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor
        ultricies metus, a rhoncus felis convallis commodo.
      </p>

      <div className="mt-3 flex gap-5 text-xs font-bold">
        <span>51 Likes</span>
        <span>xx Views</span>
      </div>
    </article>
  );
}

export default ExpandedPost;
