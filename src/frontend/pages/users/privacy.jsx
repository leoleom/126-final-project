import SettingsNavbar from "../../components/settingsNavBar";

function Privacy({ setUser }) {
  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1020px] grid-cols-[260px_1fr] bg-white">
        <SettingsNavbar setUser={setUser} />

        <main className="px-16 py-20">
          <h1 className="text-3xl font-extrabold">Privacy</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            Manage account privacy settings.
          </p>

          <section className="mt-10 max-w-[560px] space-y-4">
            <label className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-4 py-4 text-sm font-bold">
              Private Account
              <input type="checkbox" />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-4 py-4 text-sm font-bold">
              Hide Profile Activity
              <input type="checkbox" />
            </label>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Privacy;