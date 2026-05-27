import { useState } from "react";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/adminNavbar";

function AdminSettings() {
  const [allowAnonymousPosts, setAllowAnonymousPosts] = useState(true);
  const [manualReview, setManualReview] = useState(true);
  const [reportsThreshold, setReportsThreshold] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function handleSave() {
    toast.success("Admin settings saved for this session.");
  }

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
          <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[#d6dfd8] bg-[#f7faf7]/95 shadow-[0_18px_40px_rgba(63,111,79,0.08)]">
            <div className="border-b border-[#dfe6e0] px-8 py-8 xl:px-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                Administration
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#26322B]">
                Admin Settings
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                Manage moderation behavior and platform safety controls.
              </p>
            </div>

            <div className="space-y-5 px-8 py-8 xl:px-10">
              <SettingToggle
                title="Allow Anonymous Posts"
                description="Let users submit posts without showing their identity publicly."
                checked={allowAnonymousPosts}
                onChange={setAllowAnonymousPosts}
              />

              <SettingToggle
                title="Require Manual Review"
                description="Send anonymous posts to the admin queue before they become visible."
                checked={manualReview}
                onChange={setManualReview}
              />

              <div className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-6">
                <label className="text-sm font-bold text-[#26322B]">
                  Report Threshold
                </label>

                <p className="mt-2 text-sm leading-6 text-[#5F6B63]">
                  Number of reports needed before a post is prioritized for review.
                </p>

                <input
                  type="number"
                  min="1"
                  value={reportsThreshold}
                  onChange={(e) => setReportsThreshold(e.target.value)}
                  className="mt-4 h-12 w-full rounded-xl border border-[#d4ddd6] bg-white/70 px-4 text-sm text-[#26322B] outline-none transition focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                />
              </div>

              <div className="flex justify-end border-t border-[#dfe6e0] pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-12 rounded-xl bg-[#3F6F4F] px-8 text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SettingToggle({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-6 transition hover:bg-[#f4f7f4]">
      <div>
        <p className="text-sm font-bold text-[#26322B]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[#5F6B63]">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-[#3F6F4F]"
      />
    </label>
  );
}

export default AdminSettings;