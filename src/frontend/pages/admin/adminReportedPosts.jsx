import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

    try {
      const { ok, data } = await getReportedPosts();

      if (!ok) {
        toast.error("Unable to load reports.");
        setReportedPosts([]);
        return;
      }

      setReportedPosts(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load reports.");
      setReportedPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleKeep(reportId) {
    try {
      const { ok, data } = await resolveReportKeepPost(reportId);

      if (!ok) {
        toast.error(data?.error || "Failed to resolve report.");
        return;
      }

      toast.success("Report resolved. Post kept.");
      await loadReportedPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve report.");
    }
  }

  async function handleHidden(reportId, postId) {
    const confirmHide = window.confirm(
      "Are you sure you want to hide this post?"
    );

    if (!confirmHide) return;

    try {
      const { ok, data } = await resolveReportHidePost(reportId, postId);

      if (!ok) {
        toast.error(data?.error || "Failed to hide post.");
        return;
      }

      toast.success("Post hidden successfully.");
      await loadReportedPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to hide post.");
    }
  }

  async function handleDelete(reportId, postId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const { ok, data } = await resolveReportDeletePost(reportId, postId);

      if (!ok) {
        toast.error(data?.error || "Failed to delete post.");
        return;
      }

      toast.success("Post deleted successfully.");
      await loadReportedPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post.");
    }
  }

  const filteredReports =
    reportFilter === "all"
      ? reportedPosts
      : reportedPosts.filter((report) => report.status === reportFilter);

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
          <section className="mx-auto w-full max-w-[1500px] overflow-hidden rounded-[2rem] border border-[#d6dfd8] bg-[#f7faf7]/95 shadow-[0_18px_40px_rgba(63,111,79,0.08)]">
            <div className="border-b border-[#dfe6e0] px-6 py-7 md:px-8 xl:px-10">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                    Moderation
                  </p>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#26322B] md:text-4xl">
                    Reported Posts
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5F6B63]">
                    Review flagged content and take moderation action.
                  </p>
                </div>

                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#d4ddd6] bg-white px-5 text-sm font-bold text-[#26322B] outline-none transition focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20 sm:w-[230px]"
                >
                  <option value="pending">Pending Reports</option>
                  <option value="resolved">Resolved Reports</option>
                  <option value="all">All Reports</option>
                </select>
              </div>
            </div>

            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[960px] text-left">
                <thead className="border-b border-[#dfe6e0] bg-[#edf3ee]">
                  <tr>
                    <TableHead label="Post" />
                    <TableHead label="Reported By" />
                    <TableHead label="Date" />
                    <TableHead label="Status" />
                    <TableHead label="Actions" />
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <TableMessage message="Loading reports..." />
                  ) : filteredReports.length === 0 ? (
                    <TableMessage message="No reports found." />
                  ) : (
                    filteredReports.map((report, index) => (
                      <tr
                        key={report.id}
                        className={`border-b border-[#edf2ee] transition hover:bg-[#f8fbf8] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#fbfcfb]"
                        }`}
                      >
                        <td className="max-w-[320px] px-6 py-5 xl:px-8">
                          <p className="truncate font-bold text-[#26322B]">
                            {report.postTitle}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[#5F6B63] xl:px-8">
                          {report.reportedBy}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[#5F6B63] xl:px-8">
                          {report.date}
                        </td>

                        <td className="px-6 py-5 xl:px-8">
                          <StatusBadge status={report.status} />
                        </td>

                        <td className="px-6 py-5 xl:px-8">
                          {report.status === "pending" ? (
                            <div className="flex flex-nowrap gap-2">
                              <ActionButton
                                label="Keep"
                                style="green"
                                onClick={() => handleKeep(report.id)}
                              />

                              <ActionButton
                                label="Hide"
                                style="amber"
                                onClick={() =>
                                  handleHidden(report.id, report.postId)
                                }
                              />

                              <ActionButton
                                label="Delete"
                                style="red"
                                onClick={() =>
                                  handleDelete(report.id, report.postId)
                                }
                              />
                            </div>
                          ) : (
                            <span className="whitespace-nowrap text-xs font-bold text-[#7f8b84]">
                              No action needed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function TableHead({ label }) {
  return (
    <th className="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-[0.16em] text-[#5F6B63] xl:px-8">
      {label}
    </th>
  );
}

function TableMessage({ message }) {
  return (
    <tr>
      <td
        colSpan="5"
        className="px-8 py-10 text-center text-sm font-medium text-[#7f8b84]"
      >
        {message}
      </td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const resolved = status === "resolved";

  return (
    <span
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] ${
        resolved
          ? "bg-[#dff1e3] text-[#2f6b43]"
          : "bg-[#fdf1d6] text-[#9a651e]"
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({ label, style, onClick }) {
  const styles = {
    green: "border-[#3F6F4F] text-[#3F6F4F] hover:bg-[#edf5ef]",
    amber: "border-amber-300 text-amber-700 hover:bg-amber-50",
    red: "border-red-300 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-bold transition ${styles[style]}`}
    >
      {label}
    </button>
  );
}

export default AdminReportedPosts;