import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";
import {
  getReportedPosts,
  resolveReportKeepPost,
  resolveReportHidePost,
  resolveReportDeletePost,
} from "../../utils/apiUtils";

function AdminReportedPosts() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportFilter, setReportFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadReportedPosts();
  }, []);

  async function loadReportedPosts() {
    setLoading(true);
    const { ok, data } = await getReportedPosts();

    if (!ok) {
      console.error("Error fetching reported posts:", data);
      setReportedPosts([]);
      setLoading(false);
      return;
    }

    setReportedPosts(data || []);
    setLoading(false);
  }

  async function handleKeep(reportId) {
    await resolveReportKeepPost(reportId);
    alert("Report resolved. Post kept.");
    await loadReportedPosts();
  }

  async function handleHidden(reportId, postId) {
    const confirmHide = window.confirm(
      "Are you sure you want to hide this post?"
    );

    if (!confirmHide) return;

    await resolveReportHidePost(reportId, postId);
    alert("Post hidden successfully.");
    await loadReportedPosts();
  }

  async function handleDelete(reportId, postId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    await resolveReportDeletePost(reportId, postId);
    alert("Post deleted successfully.");
    await loadReportedPosts();
  }

  const filteredReports =
  reportFilter === "all"
    ? reportedPosts
    : reportedPosts.filter((report) => report.status === reportFilter);

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1280px] bg-white ${
          sidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[88px_1fr]"
        }`}
      >
        <AdminNavbar
          setUser={setUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="px-10 py-10">
          <h1 className="text-3xl font-extrabold">Reported Posts</h1>

          <p className="mt-3 text-sm text-[#6b7280]">
            Review reported posts and take moderation action.
          </p>

          <div className="mt-6">
            <select
              value={reportFilter}
              onChange={(e) => setReportFilter(e.target.value)}
              className="h-11 rounded-lg border border-[#d1d5db] bg-white px-4 text-sm font-bold outline-none focus:border-[#3f6f4f]"
            >
              <option value="pending">Pending Reports</option>
              <option value="resolved">Resolved Reports</option>
              <option value="all">All Reports</option>
            </select>
          </div>

          <section className="mt-8 rounded-lg border border-[#e5e7eb] bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[#e6f0ea]">
                <tr>
                  <th className="px-7 py-4 font-extrabold">Post</th>
                  <th className="px-7 py-4 font-extrabold">Reported By</th>
                  <th className="px-7 py-4 font-extrabold">Date</th>
                  <th className="px-7 py-4 font-extrabold">Status</th>
                  <th className="px-7 py-4 font-extrabold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-7 py-6 text-sm font-semibold text-[#6b7280]">
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-7 py-6 text-sm font-semibold text-[#6b7280]">
                      No {reportFilter === "all" ? "" : reportFilter} pending reports.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-t border-[#e5e7eb]">
                      <td className="px-7 py-4 font-semibold">
                        {report.postTitle}
                      </td>

                      <td className="px-7 py-4 font-semibold">
                        {report.reportedBy}
                      </td>

                      <td className="px-7 py-4 font-semibold">
                        {report.date}
                      </td>

                      <td className="px-7 py-4">
                        <StatusBadge status={report.status} />
                      </td>

                      <td className="px-7 py-4">
                        {report.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleKeep(report.id)}
                              className="rounded-lg border border-[#3f6f4f] px-4 py-2 text-xs font-extrabold text-[#3f6f4f] hover:bg-[#e6f0ea] cursor-pointer"
                            >
                              Keep
                            </button>

                            <button
                              type="button"
                              onClick={() => handleHidden(report.id, report.postId)}
                              className="rounded-lg border border-amber-400 px-4 py-2 text-xs font-extrabold text-amber-600 hover:bg-amber-50 cursor-pointer"
                            >
                              Hide
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(report.id, report.postId)}
                              className="rounded-lg border border-red-400 px-4 py-2 text-xs font-extrabold text-red-500 hover:bg-red-50 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#6b7280]">
                            No action needed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isResolved = status === "resolved";

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-extrabold ${
        isResolved
          ? "bg-[#bbf7d0] text-[#166534]"
          : "bg-[#fde68a] text-[#92400e]"
      }`}
    >
      {status}
    </span>
  );
}

export default AdminReportedPosts;