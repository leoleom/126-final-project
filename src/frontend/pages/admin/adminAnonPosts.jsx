import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnonymousPosts();
  }, []);

  async function loadAnonymousPosts() {
    setLoading(true);

    try {
      const { ok, data } = await getPendingAnonymousPosts();

      if (!ok) {
        setError("Failed to load anonymous posts.");
        setAnonymousPosts([]);
        return;
      }

      setError(null);
      setAnonymousPosts(data || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load anonymous posts.");
      setAnonymousPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function approvePost(id) {
    try {
      const { ok, data } = await approveAnonymousPost(id);

      if (!ok) {
        toast.error(data?.error || "Failed to approve post.");
        return;
      }

      toast.success("Anonymous post approved.");
      setAnonymousPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve post.");
    }
  }

  async function rejectPost(id) {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this anonymous post?"
    );

    if (!confirmReject) return;

    try {
      const { ok, data } = await rejectAnonymousPost(id);

      if (!ok) {
        toast.error(data?.error || "Failed to reject post.");
        return;
      }

      toast.success("Anonymous post rejected.");
      setAnonymousPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject post.");
    }
  }

  const pendingCount = anonymousPosts.filter(
    (post) => post.status === "pending"
  ).length;

  const approvedCount = anonymousPosts.filter(
    (post) => post.status === "live"
  ).length;

  const rejectedCount = anonymousPosts.filter(
    (post) => post.status === "rejected"
  ).length;

  const filteredPosts = anonymousPosts
    .filter((post) => {
      if (statusFilter !== "All" && post.status !== statusFilter) return false;

      if (dateFilter === "Today") {
        return (
          new Date(post.time).toDateString() === new Date().toDateString()
        );
      }

      return true;
    })
    .sort((a, b) =>
      sortBy === "Oldest"
        ? new Date(a.time) - new Date(b.time)
        : new Date(b.time) - new Date(a.time)
    );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[96vw] bg-[#eef3ef]/90 transition-all duration-300 ${
          sidebarOpen
            ? "grid-cols-[260px_minmax(0,1fr)]"
            : "grid-cols-[88px_minmax(0,1fr)]"
        }`}
      >
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="min-w-0 px-6 py-8 md:px-10 xl:px-14">
          <section className="mx-auto w-full max-w-[1500px] rounded-[2rem] border border-[#d6dfd8] bg-[#f7faf7]/95 shadow-[0_18px_40px_rgba(63,111,79,0.08)]">
            <div className="border-b border-[#dfe6e0] px-6 py-7 md:px-8 xl:px-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                Moderation
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#26322B] md:text-4xl">
                Review Anonymous Posts
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                Review anonymous submissions before they become publicly visible.
              </p>
            </div>

            {error && (
              <div className="mx-8 mt-8 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="px-6 py-8 md:px-8 xl:px-10">
              <section className="grid gap-5 md:grid-cols-3">
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
                  label="Sort By"
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { label: "Newest", value: "Newest" },
                    { label: "Oldest", value: "Oldest" },
                  ]}
                />
              </section>

              <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatBox
                  value={pendingCount}
                  label="Pending"
                  subtext="Awaiting review"
                  active
                />
                <StatBox
                  value={approvedCount}
                  label="Approved"
                  subtext="Published posts"
                />
                <StatBox
                  value={rejectedCount}
                  label="Rejected"
                  subtext="Declined posts"
                  danger
                />
                <StatBox
                  value={anonymousPosts.length}
                  label="Total"
                  subtext="All anonymous posts"
                />
              </section>

              <section className="mt-8 space-y-5">
                {loading ? (
                  <EmptyMessage message="Loading anonymous posts..." />
                ) : filteredPosts.length === 0 ? (
                  <EmptyMessage message="No anonymous posts found." />
                ) : (
                  filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="rounded-[1.5rem] border border-[#d4ddd6] bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="h-12 w-12 shrink-0 rounded-full bg-[#d1d5db]" />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-bold text-[#26322B]">
                                {post.user}
                              </p>
                              <StatusBadge status={post.status} />
                            </div>

                            <p className="mt-1 text-xs text-[#6b7280]">
                              {post.time}
                            </p>

                            <h2 className="mt-4 text-base font-bold text-[#26322B]">
                              {post.title}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                              {stripHtml(post.body)}
                            </p>
                          </div>
                        </div>

                        {post.status === "pending" && (
                          <div className="flex shrink-0 gap-3">
                            <ActionButton
                              label="Approve"
                              style="green"
                              onClick={() => approvePost(post.id)}
                            />

                            <ActionButton
                              label="Reject"
                              style="red"
                              onClick={() => rejectPost(post.id)}
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html || "";
  return temp.textContent || "";
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5F6B63]">
        {label}
      </p>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-[#d4ddd6] bg-white px-4 text-sm font-bold outline-none transition focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
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
      className={`rounded-[1.5rem] border p-6 ${
        active
          ? "border-[#f3d98d] bg-[#fff8de]"
          : "border-[#d4ddd6] bg-[#eef3ef]"
      }`}
    >
      <h2 className="text-3xl font-bold text-[#26322B]">{value}</h2>

      <p
        className={`mt-2 text-xs font-bold uppercase tracking-[0.12em] ${
          danger ? "text-red-500" : "text-[#3F6F4F]"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-sm text-[#5F6B63]">{subtext}</p>
    </article>
  );
}

function StatusBadge({ status }) {
  const label = status === "live" ? "Approved" : status;

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-bold ${
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

function ActionButton({ label, style, onClick }) {
  const styles = {
    green: "border-[#3F6F4F] text-[#3F6F4F] hover:bg-[#edf5ef]",
    red: "border-red-300 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-5 py-2 text-xs font-bold transition ${styles[style]}`}
    >
      {label}
    </button>
  );
}

function EmptyMessage({ message }) {
  return (
    <div className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] px-6 py-8 text-center text-sm font-medium text-[#5F6B63]">
      {message}
    </div>
  );
}

export default AdminAnonPosts;