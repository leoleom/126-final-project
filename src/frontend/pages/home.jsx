import { Link } from "react-router-dom";
import treesImage from "../public/ll-trees.png";

function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1700px] grid-cols-1 gap-8 p-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <section className="flex min-w-0 flex-col rounded-[2rem] bg-[#e6ece7] px-8 py-8 shadow-[0_20px_60px_rgba(63,111,79,0.10)] lg:px-12 lg:py-10">
          <header className="flex items-center justify-between">
            <div className="text-xl font-extrabold text-[#3f6f4f]">
              Better Better UPV{" "}
              <span className="font-normal text-[#1f2937]">wall</span>
            </div>

            <nav className="flex gap-10 text-sm font-bold text-[#111827]">
              <Link to="/guidelines"></Link>
            </nav>
          </header>

          <main className="mt-16 lg:mt-20">
            <section>
              <h1 className="max-w-[640px] text-5xl font-extrabold leading-[1.08] tracking-[-1px] text-[#3f6f4f] sm:text-[56px]">
                A space for honest conversations
              </h1>

              <p className="mt-6 max-w-[620px] text-sm leading-7 text-[#374151]">
                Share your thoughts, ask questions, and engage in meaningful
                discussions -- freely and respectfully.
              </p>

              <div className="mt-10 flex flex-wrap gap-5">
                <Link
                  to="/signup"
                  className="flex h-11 w-28 items-center justify-center rounded-xl bg-[#3f6f4f] text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(63,111,79,0.22)] transition hover:bg-[#335c41]"
                >
                  Sign up
                </Link>

                <Link
                  to="/login"
                  className="flex h-11 w-28 items-center justify-center rounded-xl border border-[#cfd8d1] bg-[#edf2ee] text-sm font-extrabold text-[#1f2937] shadow-sm transition hover:border-[#3f6f4f] hover:text-[#3f6f4f]"
                >
                  Log in
                </Link>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-base font-extrabold text-[#111827]">
                Explore discussions
              </h2>

              <p className="mt-3 text-sm text-[#374151]">
                See what people are talking about in the community.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <section className="hidden xl:block">
          <div className="relative h-full min-h-[720px] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(63,111,79,0.18)]">
            <img
              src={treesImage}
              alt="Campus trees"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1f3d2b]/18" />
          </div>
        </section>
      </div>
    </div>
  );
}

function PostPreviewCard({ username, title, tags }) {
  return (
    <article className="min-h-[230px] rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-6 shadow-[0_14px_35px_rgba(63,111,79,0.08)] transition hover:-translate-y-1 hover:bg-[#f4f7f4] hover:shadow-[0_18px_45px_rgba(63,111,79,0.12)]">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-[#c5cbc7]" />
        <span className="text-sm font-extrabold text-[#111827]">
          {username}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-extrabold leading-snug text-[#111827]">
        {title}
      </h3>

      <div className="mt-6 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#dfe8e2] px-4 py-1.5 text-xs font-extrabold text-[#3f6f4f]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-10 flex gap-12 border-t border-[#d9e1db] pt-4 text-xs font-bold text-[#7f8b84]">
        <span>126 likes</span>
        <span>299 views</span>
      </div>
    </article>
  );
}

export default Home;