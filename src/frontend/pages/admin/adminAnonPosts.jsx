import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";
import {
  getPendingAnonymousPosts,
  approveAnonymousPost,
  rejectAnonymousPost,
} from "../../utils/apiUtils";

function AdminAnonPosts() {
  const [anonymousPosts, setAnonymousPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [tagFilter, setTagFilter] = useState("All Tags");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    loadAnonymousPosts()
  }, []);

  async function loadAnonymousPosts() {
    const { data } = await getPendingAnonymousPosts();
    setAnonymousPosts(data);
  }

  async function approvePost(id) {
    await approveAnonymousPost(id);
    await loadAnonymousPosts();
  }

  async function rejectPost(id) {
    await rejectAnonymousPost(id);
    await loadAnonymousPosts();
  }

  const pendingCount = anonymousPosts.filter((post) => post.status === "pending").length;
  const approvedCount = anonymousPosts.filter((post) => post.status === "approved").length;
  const rejectedCount = anonymousPosts.filter((post) => post.status === "rejected").length;

  const filteredPosts = anonymousPosts
    .filter((post) => {
      if (statusFilter !== "All" && post.status !== statusFilter) return false;
      if (tagFilter !== "All Tags" && !post.tags?.includes(tagFilter)) return false;

      if (dateFilter === "Today") {
        return new Date(post.createdAt).toDateString() === new Date().toDateString();
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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
            <SelectBox
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "live" },
                { label: "Rejected", value: "rejected" },
                { label: "All", value: "All" },
              ]}
            />

            <SelectBox
              label="Tag"
              value={tagFilter}
              onChange={setTagFilter}
              options={[
                { label: "All Tags", value: "All Tags" },
                { label: "Academics", value: "Academics" },
                { label: "Orgs", value: "Orgs" },
                { label: "Rants", value: "Rants" },
                { label: "Lost & Found", value: "Lost & Found" },
              ]}
            />

            <SelectBox
              label="Date"
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { label: "All Time", value: "All Time" },
                { label: "Today", value: "Today" },
              ]}
            />

            <SelectBox
              label="Sort by"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: "Newest", value: "Newest" },
                { label: "Oldest", value: "Oldest" },
              ]}
            />
          </section>

          <section className="mt-8 grid grid-cols-4 gap-5">
            <StatBox value={pendingCount} label="Pending" subtext="Awaiting review" active />
            <StatBox value={approvedCount} label="Approved" subtext="This month" />
            <StatBox value={rejectedCount} label="Rejected" subtext="This month" danger />
            <StatBox value={anonymousPosts.length} label="Total Reviewed" subtext="This month" />
          </section>

          <section className="mt-8 space-y-5">
            {filteredPosts.map((post) => (
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
                      {stripHtml(post.body)}
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
                        className="rounded-lg border border-[#3f6f4f] px-5 py-2 text-xs font-extrabold text-[#3f6f4f] cursor-pointer"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectPost(post.id)}
                        className="rounded-lg border border-red-400 px-5 py-2 text-xs font-extrabold text-red-500 cursor-pointer"
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

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold text-[#374151]">{label}</p>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-xs font-bold outline-none focus:border-[#3f6f4f] cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
        status === "pending"
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