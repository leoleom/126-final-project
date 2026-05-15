import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";
import {
  getReportedPosts,
  resolveReportKeepPost,
  resolveReportHidePost,
  resolveReportDeletePost,
} from "../../services/adminService";

function AdminReportedPosts() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportedPosts();
  }, []);

  async function loadReportedPosts() {
    setLoading(true);
    const posts = await getReportedPosts();
    setReportedPosts(posts);
    setLoading(false);
  }

  async function handleKeep(reportId) {
    await resolveReportKeepPost(reportId);
    await loadReportedPosts();
  }

  async function handleHide(reportId, postId) {
    await resolveReportHidePost(reportId, postId);
    await loadReportedPosts();
  }

  async function handleDelete(reportId, postId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    await resolveReportDeletePost(reportId, postId);
    await loadReportedPosts();
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <AdminNavbar />

        <main className="px-10 py-10">
          <h1 className="text-3xl font-extrabold">Reported Posts</h1>

          <p className="mt-3 text-sm text-[#6b7280]">
            Review reported posts and take moderation action.
          </p>

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
                    <td
                      colSpan="5"
                      className="px-7 py-6 text-sm font-semibold text-[#6b7280]"
                    >
                      Loading reports...
                    </td>
                  </tr>
                ) : reportedPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-7 py-6 text-sm font-semibold text-[#6b7280]"
                    >
                      No pending reports.
                    </td>
                  </tr>
                ) : (
                  reportedPosts.map((report) => (
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
                            onClick={() => handleHide(report.id, report.postId)}
                            className="rounded-lg border border-[#f59e0b] px-4 py-2 text-xs font-extrabold text-[#b45309] hover:bg-[#fef3c7] cursor-pointer"
                          >
                            Hide
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(report.id, report.postId)
                            }
                            className="rounded-lg border border-red-400 px-4 py-2 text-xs font-extrabold text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
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
  return (
    <span className="rounded-full bg-[#fde68a] px-4 py-1 text-xs font-extrabold text-[#92400e]">
      {status}
    </span>
  );
}

export default AdminReportedPosts;