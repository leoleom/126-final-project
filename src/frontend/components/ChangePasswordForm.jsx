import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Client-side Security Validations
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      // Grab the active session token from Supabase client memory cache
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found. Please log in again.");
      }

      // Hit newly created backend server endpoint route
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update password.");
      }

      setMessage({ type: "success", text: "Password changed successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
      
      {message.text && (
        <div className={`p-3 rounded mb-4 text-sm font-medium ${
          message.type === "success" ? "bg-green-900/50 text-green-300 border border-green-600" : "bg-red-900/50 text-red-300 border border-red-600"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Min. 6 characters"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Repeat new password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}