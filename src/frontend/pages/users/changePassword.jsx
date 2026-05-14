import { useState } from "react";
import SettingsNavbar from "../../components/settingsNavBar";

function ChangePassword({ setUser }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password changed.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1020px] grid-cols-[260px_1fr] bg-white">
        <SettingsNavbar setUser={setUser} />

        <main className="px-16 py-20">
          <h1 className="text-3xl font-extrabold">Change Password</h1>

          <section className="mt-10 max-w-[560px] space-y-6">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#d1d5db] px-4 text-sm outline-none focus:border-[#3f6f4f]"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#d1d5db] px-4 text-sm outline-none focus:border-[#3f6f4f]"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#d1d5db] px-4 text-sm outline-none focus:border-[#3f6f4f]"
            />

            <button
              type="button"
              onClick={handleChangePassword}
              className="h-11 rounded-lg bg-[#3f6f4f] px-8 text-sm font-extrabold text-white"
            >
              Save Password
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ChangePassword;