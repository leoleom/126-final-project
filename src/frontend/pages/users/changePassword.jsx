import { useState } from "react";
import toast from "react-hot-toast";
import SettingsNavbar from "../../components/settingsNavbar";
import ConfirmDialog from "../../components/confirmDialog";
import { supabase } from "../../services/supabaseClient";

function ChangePassword({ setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  function handlePasswordSubmit() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields."); return;
    }

    if (newPassword.length < 8) {toast.error("New password must be at least 8 characters."); return;}
    if (!/\d/.test(newPassword)) {toast.error("Password must contain at least one number."); return;}
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return;}

    setShowPasswordConfirm(true);
  }

  async function handleChangePassword() {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message || "Failed to change password.");
      return;
    }

    toast.success("Password changed successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordConfirm(false);
  }

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
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#d6dfd8] bg-[#f6f9f6]/90 p-8 shadow-[0_16px_40px_rgba(63,111,79,0.08)] md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                Security
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#26322B]">
                Change Password
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
                Keep your account secure by updating your password regularly.
              </p>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <label className="text-sm font-bold text-[#26322B]">
                  Current Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#ffffff]/80 px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#26322B]">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#ffffff]/80 px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#26322B]">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#ffffff]/80 px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={handlePasswordSubmit}
                className="h-12 rounded-xl bg-[#3F6F4F] px-8 text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41]"
              >
                Save Password
              </button>
            </div>
          </section>
        </main>
      </div>

      <ConfirmDialog
        open={showPasswordConfirm}
        title="Change password?"
        message="Your password will be updated. Make sure you remember your new password before continuing."
        confirmText="Change Password"
        cancelText="Cancel"
        danger={false}
        onConfirm={handleChangePassword}
        onCancel={() => setShowPasswordConfirm(false)}
      />
      
    </div>
  );
}

export default ChangePassword;