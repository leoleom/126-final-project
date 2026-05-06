import { Link } from "react-router-dom";
import AuthLayout from "../../../src/frontend/components/authLayout";

function Login() {
  return (
    <AuthLayout>
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280]"
      >
        ← Back
      </Link>

      <h1 className="text-4xl font-extrabold text-[#3f6f4f]">
        Welcome back!
      </h1>

      <p className="mt-3 text-sm text-[#6b7280]">
        Login to continue the conversation.
      </p>

      <form className="mt-10 space-y-6">
        <div>
          <label className="text-sm font-bold text-[#111827]">
            Email or username
          </label>

          <input
            type="text"
            placeholder="Enter your email or username"
            className="mt-2 h-11 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#111827]">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="mt-2 h-11 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-[#6b7280]">
            <input type="checkbox" />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-[#6b7280]"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="button"
          className="h-11 w-full rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white"
        >
          Log In
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-[#e5e7eb]" />
        <span className="text-xs text-[#9ca3af]">or</span>
        <div className="h-[1px] flex-1 bg-[#e5e7eb]" />
      </div>

      <Link
        to="/signup"
        className="flex h-11 w-full items-center justify-center rounded-lg border border-[#e5e7eb] text-sm font-bold text-[#3f6f4f]"
      >
        Create New Account
      </Link>
    </AuthLayout>
  );
}

export default Login;