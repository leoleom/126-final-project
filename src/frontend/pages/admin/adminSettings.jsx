import { useState } from "react";
import AdminNavbar from "../../components/adminNavbar";

function AdminSettings() {
  const [allowAnonymousPosts, setAllowAnonymousPosts] = useState(true);
  const [manualReview, setManualReview] = useState(true);
  const [reportsThreshold, setReportsThreshold] = useState(5);

  function handleSave() {
    alert("Admin settings saved.");
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <AdminNavbar />

        <main className="px-8 py-9">
          <h1 className="text-3xl font-extrabold">Admin Settings</h1>

          <section className="mt-8 max-w-[620px] rounded-lg border border-[#e5e7eb] bg-white p-7">
            <label className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-4 py-4 text-sm font-bold">
              Allow Anonymous Posts
              <input
                type="checkbox"
                checked={allowAnonymousPosts}
                onChange={(e) => setAllowAnonymousPosts(e.target.checked)}
              />
            </label>

            <label className="mt-4 flex items-center justify-between rounded-lg border border-[#e5e7eb] px-4 py-4 text-sm font-bold">
              Require Manual Review
              <input
                type="checkbox"
                checked={manualReview}
                onChange={(e) => setManualReview(e.target.checked)}
              />
            </label>

            <div className="mt-4">
              <label className="text-sm font-bold">
                Report Threshold
              </label>

              <input
                type="number"
                value={reportsThreshold}
                onChange={(e) => setReportsThreshold(e.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-[#d1d5db] px-4 text-sm outline-none focus:border-[#3f6f4f]"
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-6 h-11 rounded-lg bg-[#3f6f4f] px-8 text-sm font-extrabold text-white"
            >
              Save Changes
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminSettings;