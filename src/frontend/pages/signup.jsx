import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "../components/authLayout";
import { signupUser } from "../utils/apiUtils";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number.");
      return;
    }

    if (!email.endsWith("@up.edu.ph")) {
      toast.error("Only @up.edu.ph email addresses are allowed.");
      return;
    }

    setLoading(true);

    const { ok, data } = await signupUser(email, username, password);

    if (!ok) {
      toast.error(data.error || "Signup failed.");
      setLoading(false);
      return;
    }

    toast.success("Account created successfully.");
    setLoading(false);
    navigate("/feed");
  }

  return (
    <AuthLayout>
      <Link
        to="/"
        className="mb-7 inline-flex rounded-full border border-[#cfd8d1] bg-[#edf2ee] px-4 py-2 text-sm font-semibold text-[#4F5C55] shadow-sm transition hover:border-[#3F6F4F] hover:text-[#3F6F4F]"
      >
        Back
      </Link>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
        Sign up
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#26322B]">
        Create an account
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
        Join the community and start sharing respectfully.
      </p>

      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-bold text-[#26322B]">Email</label>

          <input
            type="email"
            placeholder="Enter your UP email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#26322B]">Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#26322B]">Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#26322B]">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full rounded-xl bg-[#3F6F4F] text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#5F6B63]">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-[#3F6F4F]">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;