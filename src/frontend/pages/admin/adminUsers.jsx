import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";
import { supabase } from "../../services/supabaseClient";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, display_name, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setLoading(false);
      return;
    }

    const formattedUsers = data.map((user) => ({
      id: user.id,
      username: user.username ? `@${user.username}` : "No username",
      email: user.email || "No email",
      role: user.role || "user",
      status: "Active",
    }));

    setUsers(formattedUsers);
    setLoading(false);
  }

  return (
    <AdminPage title="Users">
      {loading ? (
        <p className="mt-8 text-sm font-semibold text-[#6b7280]">
          Loading users...
        </p>
      ) : (
        <AdminTable
          columns={["Username", "Email", "Role", "Status"]}
          rows={users}
          fields={["username", "email", "role", "status"]}
        />
      )}
    </AdminPage>
  );
}

function AdminPage({ title, children }) {
  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <AdminNavbar />

        <main className="px-8 py-9">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminTable({ columns, rows, fields }) {
  return (
    <section className="mt-8 rounded-lg border border-[#e5e7eb] bg-white">
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
                No users found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-[#e5e7eb]">
                {fields.map((field) => (
                  <td key={field} className="px-7 py-4 font-semibold">
                    {field === "role" ? (
                      <RoleBadge role={row[field]} />
                    ) : field === "status" ? (
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
    </section>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-extrabold ${
        isAdmin
          ? "bg-[#dbeafe] text-[#1d4ed8]"
          : "bg-[#e6f0ea] text-[#3f6f4f]"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="rounded-full bg-[#bbf7d0] px-4 py-1 text-xs font-extrabold text-[#166534]">
      {status}
    </span>
  );
}

export default AdminUsers;