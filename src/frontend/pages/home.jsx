import { Link } from "react-router-dom";
import treesImage from "../public/ll-trees.png";

function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="grid min-h-screen grid-cols-[68%_32%]">
        <section className="px-10 py-10 lg:px-12">
          <header className="flex items-center justify-between">
            <div className="text-xl font-extrabold text-[#3f6f4f]">
              Better Better UPV{" "}
              <span className="font-normal text-[#1f2937]">wall</span>
            </div>

            <nav className="flex gap-14 text-sm font-bold text-[#111827]">
              <Link to="/guidelines"></Link>
            </nav>
          </header>

          <main className="mt-20">
            <section>
              <h1 className="max-w-[520px] text-[52px] font-extrabold leading-[1.08] tracking-[-1px] text-[#3f6f4f]">
                A space for honest conversations
              </h1>

              <p className="mt-6 max-w-[600px] text-sm leading-7 text-[#374151]">
                Share your thoughts, ask questions, and engage in meaningful
                discussions -- freely and respectfully.
              </p>

                <div className="mt-10 flex gap-6">
                    <Link
                        to="/signup"
                        className="flex h-11 w-28 items-center justify-center rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white"
                    > Sign up
                    </Link>

                    <Link
                        to="/login"
                        className="flex h-11 w-28 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-sm font-extrabold text-[#111827]"
                    > Log in
                    </Link>
                </div>
            </section>

            <section className="mt-15">
              <h2 className="text-base font-extrabold text-[#111827]">
                Explore discussions
              </h2>

              <p className="mt-3 text-sm text-[#374151]">
                See what people are talking about in the community.
              </p>

              <div className="mt-10 flex gap-8">
                <PostPreviewCard
                  username="@junel"
                  title="end the sem now!"
                  tags={["academics", "students"]}
                />

                <PostPreviewCard
                  username="@leolem"
                  title="dubai chewy cookie or ilocos empanada?"
                  tags={["cravings", "not pregnant"]}
                />
              </div>
            </section>
          </main>
        </section>

        <section className="min-h-screen">
          <img
            src={treesImage}
            alt="Campus trees"
            className="h-[100%] w-full object-cover"
          />
        </section>
      </div>
    </div>
  );
}

function PostPreviewCard({ username, title, tags }) {
  return (
    <article className="min-h-[230px] w-[500px] rounded-xl border border-[#e5e7eb] bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-[#d1d5db]" />
        <span className="text-sm font-extrabold text-[#111827]">
          {username}
        </span>
      </div>

      <h3 className="mt-2 text-l font-extrabold leading-snug text-[#111827]">
        {title}
      </h3>

      <div className="mt-6 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#e6f0ea] px-4 py-1 text-xs font-extrabold text-[#1f2937]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-10 flex gap-12 text-xs font-bold text-[#9ca3af]">
        <span>126 likes</span>
        <span>299 views</span>
      </div>
    </article>
  );
}

export default Home;