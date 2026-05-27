import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabaseClient";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetLink() {
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/settings/change-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to send reset link.");
      return;
    }

    toast.success("Reset link sent. Please check your inbox.");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div className="mx-auto flex min-h-screen max-w-[1100px] items-center justify-center px-6 py-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-[#e6ece7] shadow-[0_20px_60px_rgba(63,111,79,0.14)] lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="relative hidden min-h-[620px] lg:block">
            <img
              src="/ll-trees.png"
              alt="Campus trees"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1f3d2b]/35" />
          </section>

          <main className="flex items-center justify-center px-8 py-10 sm:px-10">
            <section className="w-full max-w-[430px] rounded-[1.5rem] bg-[#eef3ef] px-8 py-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
              <Link
                to="/login"
                className="inline-flex rounded-full border border-[#cfd8d1] bg-[#edf2ee] px-4 py-2 text-sm font-semibold text-[#4F5C55] shadow-sm transition hover:border-[#3F6F4F] hover:text-[#3F6F4F]"
              >
                Back to login
              </Link>

              <div className="mt-14">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3F6F4F]">
                  Password reset
                </p>

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#26322B]">
                  Forgot your password?
                </h1>

                <p className="mt-5 text-sm leading-6 text-[#5F6B63]">
                  No worries. Enter your email and we’ll send you a link to reset it.
                </p>

                <div className="mt-7">
                  <label className="text-sm font-extrabold text-[#26322B]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-2 h-12 w-full rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-4 text-sm text-[#26322B] shadow-sm outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResetLink}
                  disabled={loading}
                  className="mt-7 h-12 w-full rounded-xl bg-[#3F6F4F] text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </div>

              <p className="mt-20 text-center text-xs leading-5 text-[#5F6B63]">
                Check your inbox and follow the instructions
                <br />
                in the email.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;