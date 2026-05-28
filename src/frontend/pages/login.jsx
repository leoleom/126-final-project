import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "../components/authLayout";
import { loginUser } from "../utils/apiUtils";
import { supabase } from "../services/supabaseClient";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!emailOrUsername.trim() || !password.trim()) {
        toast.error("Please enter your email/username and password.");
        setLoading(false);
        return;
      }

      const { ok, data } = await loginUser(emailOrUsername, password);

      if (!ok) {
        toast.error(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      const email = data.user?.email;
      if (!email) {
        toast.error("Login failed. User email not found.");
        setLoading(false);
        return;
      }

      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        toast.error(supabaseError.message || "Supabase session failed.");
        setLoading(false);
        return;
      }

      setUser(data.user);
      toast.success("Logged in successfully.");
      navigate("/feed");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Link
        to="/"
        className="mb-8 inline-flex rounded-full border border-[#cfd8d1] bg-[#edf2ee] px-4 py-2 text-sm font-semibold text-[#4F5C55] shadow-sm transition hover:border-[#3F6F4F] hover:text-[#3F6F4F]"
      >
        Back
      </Link>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
        Login
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#26322B]">
        Welcome back
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
        Log in to continue the conversation in a respectful community space.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-bold text-[#26322B]">
            Email or username
          </label>

          <input
            type="text"
            placeholder="Enter your email or username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#26322B]">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#3F6F4F] transition hover:text-[#335C41]"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#3F6F4F] text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-[#d9e1db]" />
        <span className="text-xs font-medium text-[#7f8b84]">or</span>
        <div className="h-[1px] flex-1 bg-[#d9e1db]" />
      </div>

      <Link
        to="/signup"
        className="flex h-12 w-full items-center justify-center rounded-xl border border-[#cfd8d1] bg-[#edf2ee] text-sm font-bold text-[#3F6F4F] shadow-sm transition hover:border-[#3F6F4F] hover:text-[#335C41]"
      >
        Create new account
      </Link>
    </AuthLayout>
  );
}

export default Login;