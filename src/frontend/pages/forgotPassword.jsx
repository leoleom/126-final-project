import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleResetLink() {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setMessage("Reset link sent. Please check your inbox.");
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[900px] grid-cols-[280px_1fr] bg-white">
        <section>
          <img
            src="/ll-trees.png"
            alt="Campus trees"
            className="h-full w-full object-cover"
          />
        </section>

        <main className="flex items-center justify-center px-10">
          <section className="min-h-[560px] w-full max-w-[420px] rounded-lg bg-white px-10 py-8 shadow-sm">
            <Link
              to="/login"
              className="text-xs font-extrabold text-[#6b7280]"
            >
              ← Back to login
            </Link>

            <div className="mt-16">
              <h1 className="text-2xl font-extrabold text-[#3f6f4f]">
                Forgot your password?
              </h1>

              <p className="mt-6 text-sm leading-6 text-[#6b7280]">
                No worries. Enter your email and we’ll send you a link to reset it.
              </p>

              <div className="mt-7">
                <label className="text-sm font-extrabold text-[#111827]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 h-11 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
                />
              </div>

              <button
                type="button"
                onClick={handleResetLink}
                className="mt-7 h-11 w-full rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white"
              >
                Send reset link
              </button>

              {message && (
                <p className="mt-5 text-center text-sm font-semibold text-[#3f6f4f]">
                  {message}
                </p>
              )}
            </div>

            <p className="mt-36 text-center text-xs leading-5 text-[#6b7280]">
              Check your inbox and follow the instructions
              <br />
              in the email.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;
