import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";

function AdminAnonPosts() {
  const [anonymousPosts, setAnonymousPosts] = useState([]);

  useEffect(() => {
    setAnonymousPosts([
      {
        id: 1,
        user: "Anonymous user",
        time: "2h ago",
        title: "Groupmates not doing their part :<",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor ultricies metus.",
        status: "Pending",
      },
      {
        id: 2,
        user: "Anonymous user",
        time: "5h ago",
        title: "Awa nalang talaga",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        status: "Pending",
      },
      {
        id: 3,
        user: "Anonymous user",
        time: "8h ago",
        title: "Aita for wanting to leave",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        status: "Pending",
      },
    ]);
  }, []);

  function approvePost(id) {
    setAnonymousPosts((posts) =>
      posts.map((post) =>
        post.id === id ? { ...post, status: "Approved" } : post
      )
    );
  }

  function rejectPost(id) {
    setAnonymousPosts((posts) =>
      posts.map((post) =>
        post.id === id ? { ...post, status: "Rejected" } : post
      )
    );
  }

  const pendingCount = anonymousPosts.filter((post) => post.status === "Pending").length;
  const approvedCount = anonymousPosts.filter((post) => post.status === "Approved").length;
  const rejectedCount = anonymousPosts.filter((post) => post.status === "Rejected").length;

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <AdminNavbar />

        <main className="px-10 py-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">Review Anonymous Posts</h1>
              <p className="mt-3 text-sm text-[#6b7280]">
                Pending anonymous posts that need admin review before they are published.
              </p>
            </div>

            <button className="rounded-lg bg-[#e6f0ea] px-6 py-3 text-sm font-extrabold text-white opacity-60">
              Publish
            </button>
          </div>

          <section className="mt-8 grid grid-cols-4 gap-5">
            <SelectBox label="Status" value="Pending" />
            <SelectBox label="Tag" value="All Tags" />
            <SelectBox label="Date" value="All Time" />
            <SelectBox label="Sort by" value="Newest" />
          </section>

          <section className="mt-8 grid grid-cols-4 gap-5">
            <StatBox value={pendingCount} label="Pending" subtext="Awaiting review" active />
            <StatBox value={approvedCount} label="Approved" subtext="This month" />
            <StatBox value={rejectedCount} label="Rejected" subtext="This month" danger />
            <StatBox value={anonymousPosts.length} label="Total Reviewed" subtext="This month" />
          </section>

          <section className="mt-8 space-y-5">
            {anonymousPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg border border-[#e5e7eb] bg-white p-6"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#d1d5db]" />

                    <div>
                      <p className="text-sm font-extrabold">{post.user}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">{post.time}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-sm font-extrabold">{post.title}</h2>
                    <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#374151]">
                      {post.body}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <span className="h-5 w-20 rounded bg-[#e6f0ea]" />
                      <span className="h-5 w-20 rounded bg-[#e6f0ea]" />
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <StatusBadge status={post.status} />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => approvePost(post.id)}
                        className="rounded-lg border border-[#3f6f4f] px-5 py-2 text-xs font-extrabold text-[#3f6f4f]"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectPost(post.id)}
                        className="rounded-lg border border-red-400 px-5 py-2 text-xs font-extrabold text-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <Pagination />
        </main>
      </div>
    </div>
  );
}

function SelectBox({ label, value }) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold text-[#374151]">{label}</p>
      <button className="flex h-11 w-full items-center justify-between rounded-lg border border-[#e5e7eb] bg-white px-4 text-xs font-bold">
        {value}
        <span>⌄</span>
      </button>
    </div>
  );
}

function StatBox({ value, label, subtext, active, danger }) {
  return (
    <article
      className={`rounded-lg border p-5 ${
        active ? "border-[#fde68a] bg-[#fff7d6]" : "border-[#e5e7eb] bg-white"
      }`}
    >
      <h2 className="text-3xl font-extrabold">{value}</h2>
      <p className={`mt-2 text-xs font-extrabold ${danger ? "text-red-500" : "text-[#3f6f4f]"}`}>
        {label}
      </p>
      <p className="mt-1 text-xs text-[#6b7280]">{subtext}</p>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-extrabold ${
        status === "Pending"
          ? "bg-[#fde68a] text-[#92400e]"
          : status === "Approved"
          ? "bg-[#bbf7d0] text-[#166534]"
          : "bg-[#fecaca] text-[#991b1b]"
      }`}
    >
      {status}
    </span>
  );
}

function Pagination() {
  return (
    <div className="mt-8 flex justify-center gap-3">
      <button className="rounded bg-white px-3 py-2 text-xs font-bold">‹</button>
      <button className="rounded bg-white px-3 py-2 text-xs font-bold">1</button>
      <button className="rounded bg-white px-3 py-2 text-xs font-bold">›</button>
    </div>
  );
}

export default AdminAnonPosts;
