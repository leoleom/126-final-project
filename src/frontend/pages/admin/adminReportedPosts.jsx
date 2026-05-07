import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";

function AdminReportedPosts() {
  const [activeTab, setActiveTab] = useState("All");
  const [reportedPosts, setReportedPosts] = useState([]);

  useEffect(() => {
    setReportedPosts([
      {
        id: 1,
        title: "Anonymous Post",
        reportedBy: "xxxx",
        date: "May 02, 2029",
        status: "Pending",
      },
      {
        id: 2,
        title: "Anonymous Post",
        reportedBy: "xxxx",
        date: "April 30, 2029",
        status: "Pending",
      },
      {
        id: 3,
        title: "Anonymous Post",
        reportedBy: "xxxx",
        date: "April 26, 2029",
        status: "Pending",
      },
      {
        id: 4,
        title: "Anonymous Post",
        reportedBy: "xxxx",
        date: "April 12, 2029",
        status: "Pending",
      },
    ]);
  }, []);

  const filteredPosts =
    activeTab === "All"
      ? reportedPosts
      : reportedPosts.filter((post) => post.status === activeTab);

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <AdminNavbar />

        <main className="px-10 py-10">
          <h1 className="text-3xl font-extrabold">Reported Posts</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            Posts that are reported by users.
          </p>

          <div className="mt-8 flex gap-5">
            {["All", "Pending", "Reviewed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-6 py-3 text-sm font-extrabold ${
                  activeTab === tab
                    ? "border-b-4 border-[#3f6f4f] bg-[#e6f0ea] text-[#111827]"
                    : "bg-white text-[#111827]"
                }`}
              >
                {tab} ({tab === "All" ? reportedPosts.length : reportedPosts.filter((post) => post.status === tab).length})
              </button>
            ))}
          </div>

          <section className="mt-8 space-y-5">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-white p-6"
              >
                <div>
                  <h2 className="text-sm font-extrabold">{post.title}</h2>
                  <p className="mt-2 text-xs text-[#6b7280]">
                    Reported by {post.reportedBy}
                  </p>
                </div>

                <p className="text-sm font-extrabold">{post.date}</p>

                <StatusBadge status={post.status} />
              </article>
            ))}
          </section>

          <Pagination />
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-extrabold ${
        status === "Pending"
          ? "bg-[#fde68a] text-[#92400e]"
          : "bg-[#bbf7d0] text-[#166534]"
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

export default AdminReportedPosts;
