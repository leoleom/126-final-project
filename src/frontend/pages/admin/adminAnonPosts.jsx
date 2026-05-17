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
  const [dateFilter, setDateFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("Newest");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnonymousPosts();
  }, []);

  async function loadAnonymousPosts() {
    const { ok, data } = await getPendingAnonymousPosts();

    if (!ok) {
      console.error("Error fetching anonymous posts:", data);
      setError("Failed to load anonymous posts.");
      setAnonymousPosts([]);
      return;
    }

    setError(null);
    setAnonymousPosts(data || []);
  }

  async function approvePost(id) {
    const result = await approveAnonymousPost(id);

    if (!ok) {alert(data?.error || "Failed to approve post."); return;}
    alert("Anonymous post approved.");
    await loadAnonymousPosts();
  }

  async function rejectPost(id) {
    const { ok, data } = await rejectAnonymousPost(id);

    if (!ok) {alert(data?.error || "Failed to reject post."); return;}
    await rejectAnonymousPost(id);
    alert("Anonymous post rejected.");
    await loadAnonymousPosts();
  }

  const pendingCount = anonymousPosts.filter((post) => post.status === "pending").length;
  const approvedCount = anonymousPosts.filter((post) => post.status === "live").length;
  const rejectedCount = anonymousPosts.filter((post) => ["rejected"].includes(post.status)).length;

  const filteredPosts = anonymousPosts
    .filter((post) => {
      if (statusFilter !== "All" && post.status !== statusFilter) return false;

      if (dateFilter === "Today") {
        return new Date(post.time).toDateString() === new Date().toDateString();
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Oldest") {
        return new Date(a.time) - new Date(b.time);
      }

      return new Date(b.time) - new Date(a.time);
    });

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1280px] bg-white ${
          sidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[88px_1fr]"
        }`}
      >
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="px-10 py-10">
          <h1 className="text-3xl font-extrabold">Review Anonymous Posts</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            Review anonymous posts before they are published or rejected.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
    
          <section className="mt-8 grid grid-cols-3 gap-5">
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
            <StatBox value={approvedCount} label="Approved" subtext="Published posts" />
            <StatBox value={rejectedCount} label="Rejected" subtext="Rejected posts" danger />
            <StatBox value={anonymousPosts.length} label="Total Anonymous Posts" subtext="All statuses" />
          </section>

          <section className="mt-8 space-y-5">
            {filteredPosts.length === 0 ? (
              <p className="rounded-lg border border-[#e5e7eb] bg-white p-6 text-sm font-semibold text-[#6b7280]">
                No anonymous posts found.
              </p>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.id} className="rounded-lg border border-[#e5e7eb] bg-white p-6">
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
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <StatusBadge status={post.status} />

                      {post.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => approvePost(post.id)}
                            className="rounded-lg border border-[#3f6f4f] px-5 py-2 text-xs font-extrabold text-[#3f6f4f] cursor-pointer hover:bg-[#e6f0ea]"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => rejectPost(post.id)}
                            className="rounded-lg border border-red-400 px-5 py-2 text-xs font-extrabold text-red-500 cursor-pointer hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html || "";
  return temp.textContent || temp.innerText || "";
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold text-[#374151]">{label}</p>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-4 text-xs font-bold outline-none focus:border-[#3f6f4f] cursor-pointer"
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
  const label = status === "live" ? "approved" : status;

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-extrabold ${
        status === "pending"
          ? "bg-[#fde68a] text-[#92400e]"
          : status === "live"
          ? "bg-[#bbf7d0] text-[#166534]"
          : "bg-[#fecaca] text-[#991b1b]"
      }`}
    >
      {label}
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