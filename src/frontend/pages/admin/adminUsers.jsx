import { useEffect, useState } from "react";
import AdminNavbar from "../../components/adminNavbar";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { id: 1, username: "@leolem", email: "leolem@up.edu.ph", role: "User", status: "Active" },
      { id: 2, username: "@junel", email: "junel@up.edu.ph", role: "User", status: "Active" },
      { id: 2, username: "@cjtarre", email: "cltarre@up.edu.ph", role: "User", status: "Active" },
      { id: 3, username: "@admin", email: "admin@up.edu.ph", role: "Admin", status: "Active" },
    ]);
  }, []);

  return (
    <AdminPage title="Users">
      <AdminTable
        columns={["Username", "Email", "Role", "Status"]}
        rows={users}
        fields={["username", "email", "role", "status"]}
      />
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
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[#e5e7eb]">
              {fields.map((field) => (
                <td key={field} className="px-7 py-4 font-semibold">
                  {row[field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default AdminUsers;