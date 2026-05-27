import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SettingsNavbar from "../../components/settingsNavbar";
import {
  getUserNotifications,
  markNotificationsAsRead,
} from "../../utils/apiUtils";

function Notifications({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { ok, data } = await getUserNotifications(user.id);

      if (!ok) {
        toast.error("Unable to load notifications.");
        setNotifications([]);
        setLoading(false);
        return;
      }

      setNotifications(data || []);

      // Mark unread notifications as read after loading
      await markNotificationsAsRead(user.id);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Unable to load notifications.");
      setNotifications([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadNotifications();
  }, [user]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1440px] bg-[#eef3ef]/90 transition-all duration-300 ${
          sidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[88px_1fr]"
        }`}
      >
        <SettingsNavbar
          setUser={setUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="px-8 py-10 md:px-12 lg:px-16">
          <section className="mx-auto max-w-4xl rounded-[2rem] border border-[#d6dfd8] bg-[#f6f9f6]/90 p-8 shadow-[0_16px_40px_rgba(63,111,79,0.08)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
              Account Activity
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#26322B]">
              Notifications
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
              Stay updated on post approvals, rejections, and account activity.
            </p>

            <section className="mt-10 space-y-4">
              {loading ? (
                <LoadingNotifications />
              ) : notifications.length === 0 ? (
                <EmptyState />
              ) : (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))
              )}
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

function LoadingNotifications() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-[1.5rem] bg-[#eef3ef] shadow-[0_10px_24px_rgba(63,111,79,0.06)]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] px-6 py-8 text-center shadow-sm">
      <h2 className="text-lg font-bold text-[#26322B]">
        No notifications yet
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#5F6B63]">
        Updates about approvals, rejections, and account activity will appear
        here.
      </p>
    </div>
  );
}

function NotificationCard({ notification }) {
  return (
    <article
      className={`rounded-[1.5rem] border px-6 py-5 shadow-sm transition hover:-translate-y-0.5 ${
        notification.is_read
          ? "border-[#d4ddd6] bg-[#eef3ef]"
          : "border-[#bfd9c9] bg-[#e2eee6]"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-bold leading-6 text-[#26322B]">
            {notification.message}
          </p>

          <p className="mt-2 text-xs font-medium text-[#7f8b84]">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>

        {!notification.is_read && (
          <span className="mt-1 rounded-full bg-[#3F6F4F] px-3 py-1 text-xs font-bold text-white">
            New
          </span>
        )}
      </div>
    </article>
  );
}

export default Notifications;