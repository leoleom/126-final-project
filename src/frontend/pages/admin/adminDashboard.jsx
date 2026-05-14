import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminNavbar from "../../components/adminNavbar";
import { getAdminDashboardData } from "../../services/adminService";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [anonymousPosts, setAnonymousPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);

  useEffect(() => {
    async function loadAdminData() {
      const data = await getAdminDashboardData();

      setUsers(data.users);
      setPosts(data.posts);
      setAnonymousPosts(data.anonymousPosts);
      setReportedPosts(data.reportedPosts);
    }

    loadAdminData();
  }, []);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const pendingReports = reportedPosts.filter(
    (post) => post.status === "Pending"
  ).length;

  const pendingAnonymousPosts = anonymousPosts.filter(
    (post) => post.status === "Pending"
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      change: "Registered accounts",
    },
    {
      label: "Total Posts",
      value: posts.length + anonymousPosts.length,
      change: `${pendingAnonymousPosts} pending anonymous`,
    },
    {
      label: "Reported Posts",
      value: reportedPosts.length,
      change: `${pendingReports} pending`,
    },
    {
      label: "Active Now",
      value: activeUsers,
      change: "Online",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <AdminNavbar />

        <main className="px-8 py-9">
          <section className="grid grid-cols-4 gap-5">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <DataTable
            title="Review Anonymous Posts"
            columns={["Post", "ID", "Date", "Status"]}
            rows={anonymousPosts}
            fields={["post", "id", "date", "status"]}
            linkText="View all anonymous posts"
            linkPath="/admin/anonymous-posts"
          />

          <DataTable
            title="Recent Reported Posts"
            columns={["Post", "Reported by", "Reason", "Date", "Status"]}
            rows={reportedPosts}
            fields={["post", "reportedBy", "reason", "date", "status"]}
            linkText="View all reported posts"
            linkPath="/admin/reported-posts"
          />
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, change }) {
  return (
    <article className="rounded-lg border border-[#e5e7eb] bg-white p-7">
      <p className="text-sm font-extrabold text-[#111827]">{label}</p>

      <h2 className="mt-6 text-4xl font-extrabold text-[#1f2937]">
        {value}
      </h2>

      <p className="mt-6 text-xs font-bold text-[#3f6f4f]">{change}</p>
    </article>
  );
}

function DataTable({ title, columns, rows, fields, linkText, linkPath }) {
  return (
    <section className="mt-6 rounded-lg border border-[#e5e7eb] bg-white">
      <h2 className="px-7 py-5 text-xl font-extrabold">{title}</h2>

      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[#e6f0ea]">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-7 py-4 font-extrabold">
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
                className="px-7 py-6 text-sm font-semibold text-[#6b7280]"
              >
                No data available.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[#e5e7eb]">
                {fields.map((field) => (
                  <td key={field} className="px-7 py-4 font-semibold">
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

      <Link
        to={linkPath}
        className="block px-7 py-4 text-sm font-extrabold text-[#3f6f4f]"
      >
        {linkText} →
      </Link>
    </section>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-extrabold ${
        status === "Pending"
          ? "bg-[#fde68a] text-[#92400e]"
          : status === "Reviewed" || status === "Approved"
          ? "bg-[#bbf7d0] text-[#166534]"
          : "bg-[#fecaca] text-[#991b1b]"
      }`}
    >
      {status}
    </span>
  );
}

export default AdminDashboard;