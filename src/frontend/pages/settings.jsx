import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SettingsNavbar from "../components/settingsNavbar";
import { updateUserProfile, uploadAvatar } from "../utils/apiUtils";
import ConfirmDialog from "../components/confirmDialog";
import ChangePasswordForm from "../components/ChangePasswordForm";

function Settings({ user, setUser }) {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(
    user?.display_name || user?.username || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.avatar_url || ""
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleProfilePictureChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const previewUrl = URL.createObjectURL(file);
    setProfilePicture(previewUrl);

    try {
      const { ok, data } = await uploadAvatar(user.id, file);

      if (!ok) {
        toast.error(data.error || "Upload failed.");
        URL.revokeObjectURL(previewUrl);
        setUploading(false);
        return;
      }

      setProfilePicture(data.publicUrl);
      URL.revokeObjectURL(previewUrl);

      toast.success("Profile photo updated.");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
      URL.revokeObjectURL(previewUrl);
    }

    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);

    try {
      const { ok, data } = await updateUserProfile(user.id, {
        display_name: displayName,
        bio,
        avatar_url: profilePicture,
      });

      if (!ok) {
        toast.error(data.error || "Failed to save profile.");
        setSaving(false);
        return;
      }

      setUser({
        ...user,
        display_name: data.display_name,
        username: data.username,
        bio: data.bio,
        avatar_url: data.avatar_url,
      });

      toast.success("Settings saved.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile.");
    }

    setSaving(false);
  }

  function handleDeleteAccount() {
    setShowDeleteConfirm(false);
    setUser(null);
    toast.success("Account deleted.");
    navigate("/");
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
                Account
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                Manage your profile information and account preferences.
              </p>
            </section>

            {/* Profile Inputs Card Section */}
            <section className="mt-8 rounded-[2rem] bg-[#eef3ef] p-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
              <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
                {/* Profile Preview */}
                <div>
                  <p className="text-sm font-bold text-[#26322B]">
                    Profile Picture
                  </p>

                  <div className="mt-5 flex flex-col items-center rounded-[1.5rem] border border-[#d4ddd6] bg-[#e6ece7] p-6">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover shadow-[0_12px_24px_rgba(63,111,79,0.12)]"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-[#c5cbc7]" />
                    )}

                    <label className="mt-6 flex h-11 cursor-pointer items-center justify-center rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-6 text-sm font-bold text-[#3F6F4F] transition hover:bg-white">
                      {uploading ? "Uploading..." : "Change Photo"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-[#26322B]">
                      Display Name
                    </label>

                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-4 text-sm text-[#26322B] shadow-sm outline-none transition focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#26322B]">
                      UPV Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-4 text-sm text-[#26322B] shadow-sm outline-none transition focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#26322B]">
                      Bio
                    </label>

                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the community a little about yourself."
                      className="mt-2 min-h-[180px] w-full rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-4 py-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 border-t border-[#d4ddd6] pt-8 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-12 rounded-xl border border-red-200 bg-red-50 px-8 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  Delete Account
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-12 rounded-xl bg-[#3F6F4F] px-8 text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] bg-[#eef3ef] p-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
              <ChangePasswordForm />
            </section>
          </div>
        </main>
      </div>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete account?"
        message="This action cannot be undone. Your account will be removed from this session."
        confirmText="Delete Account"
        cancelText="Cancel"
        danger
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default Settings;