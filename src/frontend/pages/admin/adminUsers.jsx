import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/adminNavbar";
import { getAdminUsers } from "../../utils/apiUtils";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    try {
      const { ok, data } = await getAdminUsers();

      if (!ok) {
        toast.error("Unable to load users.");
        setUsers([]);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

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
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                Administration
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#26322B] md:text-4xl">
                Users
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                View registered accounts and their current access roles.
              </p>
            </div>

            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-[#dfe6e0] bg-[#edf3ee]">
                  <tr>
                    <TableHead label="Username" />
                    <TableHead label="Email" />
                    <TableHead label="Role" />
                    <TableHead label="Status" />
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <TableMessage message="Loading users..." />
                  ) : users.length === 0 ? (
                    <TableMessage message="No users found." />
                  ) : (
                    users.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`border-b border-[#edf2ee] transition hover:bg-[#f8fbf8] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#fbfcfb]"
                        }`}
                      >
                        <td className="px-6 py-5 font-bold text-[#26322B] xl:px-8">
                          {user.username || "No username"}
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[#5F6B63] xl:px-8">
                          {user.email || "No email"}
                        </td>

                        <td className="px-6 py-5 xl:px-8">
                          <RoleBadge role={user.role} />
                        </td>

                        <td className="px-6 py-5 xl:px-8">
                          <StatusBadge status={user.status} />
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
        colSpan="4"
        className="px-8 py-10 text-center text-sm font-medium text-[#7f8b84]"
      >
        {message}
      </td>
    </tr>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${
        isAdmin
          ? "bg-[#edf3f6] text-[#365766]"
          : "bg-[#dff1e3] text-[#2f6b43]"
      }`}
    >
      {role || "user"}
    </span>
  );
}

function StatusBadge({ status }) {
  const value = status || "active";

  return (<span className="whitespace-nowrap rounded-full bg-[#dff1e3] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#2f6b43]">{value}</span>);
}

export default AdminUsers;