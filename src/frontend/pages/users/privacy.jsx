import { useState } from "react";
import SettingsNavbar from "../../components/settingsNavBar";
import toast from "react-hot-toast";
import { updateUserProfile } from "../../utils/apiUtils";

function Privacy({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(user?.private_account ?? false);
  const [hideActivity, setHideActivity] = useState(user?.hide_activity ?? false);
  const [saving, setSaving] = useState(false);

  async function handleSavePrivacy(nextPrivateAccount, nextHideActivity) {
    if (!user?.id) {
      toast.error("User not found.");
      return;
    }

    setSaving(true);

    const { ok, data } = await updateUserProfile(user.id, {
      private_account: nextPrivateAccount,
      hide_activity: nextHideActivity,
    });

    setSaving(false);

    if (!ok) {
      toast.error(data?.error || "Failed to save privacy settings.");
      return;
    }

    setUser?.({
      ...user,
      private_account: data.private_account,
      hide_activity: data.hide_activity,
    });

    toast.success("Privacy settings saved.");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1680px] bg-[#e6ece7]/80 shadow-[0_20px_60px_rgba(63,111,79,0.12)] transition-all duration-300 ${
          sidebarOpen
            ? "grid-cols-[280px_minmax(0,1fr)]"
            : "grid-cols-[96px_minmax(0,1fr)]"
        }`}
      >
        <SettingsNavbar
          setUser={setUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="min-w-0 px-6 py-8 xl:px-10 2xl:px-14">
          <div className="mx-auto max-w-[980px]">
            <section className="rounded-[2rem] bg-[#eef3ef] px-8 py-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#3F6F4F]">
                Account Settings
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[#26322B] sm:text-4xl">
                Privacy
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                Manage account privacy settings.
              </p>
            </section>

            <section className="mt-8 space-y-4 rounded-[2rem] bg-[#eef3ef] p-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
              <PrivacyToggle
                title="Private Account"
                description="Limit access to your profile and posts."
                checked={privateAccount}
                disabled={saving}
                onChange={(value) => {
                  setPrivateAccount(value);
                  handleSavePrivacy(value, hideActivity);
                }}
              />

              <PrivacyToggle
                title="Hide Profile Activity"
                description="Keep your likes, bookmarks, and activity less visible."
                checked={hideActivity}
                disabled={saving}
                onChange={(value) => {
                  setHideActivity(value);
                  handleSavePrivacy(privateAccount, value);
                }}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function PrivacyToggle({ title, description, checked, onChange, disabled }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 rounded-[1.5rem] border border-[#d4ddd6] bg-[#f4f7f4] px-6 py-5 shadow-sm transition hover:bg-white">
      <div>
        <p className="text-sm font-bold text-[#26322B]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#5F6B63]">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-[#3F6F4F]"
      />
    </label>
  );
}

export default Privacy;