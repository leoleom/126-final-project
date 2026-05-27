import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/adminNavbar";
import { getAdminDashboardData } from "../../utils/apiUtils";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [anonymousPosts, setAnonymousPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    const { ok, data } = await getAdminDashboardData();

    if (!ok) {
      console.error("Error fetching admin dashboard data:", data);
      setUsers([]);
      setPosts([]);
      setAnonymousPosts([]);
      setReportedPosts([]);
      return;
    }

    setUsers(data.users || []);
    setPosts(data.posts || []);
    setAnonymousPosts(data.anonymousPosts || []);
    setReportedPosts(data.reportedPosts || []);
  }

  const livePosts = posts.filter((post) => post.status === "live").length;

  const pendingReports = reportedPosts.filter(
    (post) => post.status === "pending"
  ).length;

  const pendingAnonymousPosts = anonymousPosts.filter(
    (post) => post.status === "pending"
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      subtitle: "Registered accounts",
      tone: "blue",
    },
    {
      label: "Total Posts",
      value: posts.length,
      subtitle: `${pendingAnonymousPosts} pending anonymous`,
      tone: "green",
    },
    {
      label: "Reports",
      value: reportedPosts.length,
      subtitle: `${pendingReports} pending review`,
      tone: "amber",
    },
    {
      label: "Live Posts",
      value: livePosts,
      subtitle: "Currently visible",
      tone: "mint",
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[95vw] bg-[#eef3ef]/90 transition-all duration-300 ${
          sidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[88px_1fr]"
        }`}
      >
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="px-8 py-10 md:px-12 xl:px-16">
          <section className="mx-auto overflow-hidden rounded-[2rem] border border-[#d6dfd8] bg-[#f7faf7]/95 shadow-[0_18px_40px_rgba(63,111,79,0.08)]">
            {/* Header */}
            <div className="border-b border-[#dfe6e0] px-8 py-8 xl:px-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                Administration
              </p>

              <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-[#26322B]">
                    Dashboard Overview
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                    Monitor community activity, moderation tasks, and platform
                    health.
                  </p>
                </div>

                <div className="w-fit rounded-2xl border border-[#d4ddd6] bg-[#e7eee8] px-5 py-3 text-sm font-bold text-[#3F6F4F]">
                  Admin Control Panel
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>

            {/* Anonymous Posts */}
            <div className="px-8 py-8 xl:px-10">
              <SectionTable
                title="Review Anonymous Posts"
                rows={anonymousPosts}
                columns={["Post", "ID", "Date", "Status"]}
                fields={["post", "id", "date", "status"]}
                linkText="View all anonymous posts"
                linkPath="/admin/anonymous-posts"
                tone="blue"
              />
            </div>

            <div className="mx-8 h-px bg-[#e3e9e4] xl:mx-10" />

            {/* Reported Posts */}
            <div className="px-8 py-8 xl:px-10">
              <SectionTable
                title="Recent Reported Posts"
                rows={reportedPosts}
                columns={["Post", "Reported by", "Date", "Status"]}
                fields={["post", "reportedBy", "date", "status"]}
                linkText="View all reported posts"
                linkPath="/admin/reported-posts"
                tone="amber"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtitle, tone }) {
  const tones = {
    blue: "bg-[#eef4f6] text-[#365766]",
    green: "bg-[#edf5ee] text-[#3F6F4F]",
    amber: "bg-[#f7f1e4] text-[#8A5A2B]",
    mint: "bg-[#eaf4ef] text-[#3F725A]",
  };

  return (
    <article
      className={`rounded-2xl px-5 py-5 shadow-sm ${
        tones[tone] || tones.green
      }`}
    >
      <p className="text-sm font-bold text-[#5F6B63]">{label}</p>

      <h2 className="mt-4 text-4xl font-bold text-[#26322B]">{value}</h2>

      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em]">
        {subtitle}
      </p>
    </article>
  );
}

function SectionTable({
  title,
  rows,
  columns,
  fields,
  linkText,
  linkPath,
  tone,
}) {
  const tones = {
    blue: "bg-[#edf3f6]",
    amber: "bg-[#f7f1e4]",
    green: "bg-[#e7eee8]",
  };

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#26322B]">{title}</h2>
          <p className="mt-1 text-sm text-[#7A857E]">
            {rows.length} item{rows.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Link
          to={linkPath}
          className="text-sm font-bold text-[#3F6F4F] transition hover:text-[#335C41]"
        >
          {linkText} →
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dbe4dd] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className={tones[tone] || tones.green}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#5F6B63]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-sm text-[#7f8b84]"
                  >
                    No data available.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className="border-t border-[#edf2ee] transition hover:bg-[#f8fbf9]"
                  >
                    {fields.map((field) => (
                      <td
                        key={field}
                        className="px-6 py-5 text-sm font-medium text-[#26322B]"
                      >
                        {field === "status" ? (
                          <StatusBadge status={row[field]} />
                        ) : (
                          row[field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const label = status === "live" ? "approved" : status;

  return (
    <span
      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${
        status === "pending"
          ? "bg-[#fef3c7] text-[#92400e]"
          : status === "live" || status === "resolved"
          ? "bg-[#d7f0dd] text-[#166534]"
          : "bg-[#fee2e2] text-[#991b1b]"
      }`}
    >
      {label}
    </span>
  );
}

export default AdminDashboard;