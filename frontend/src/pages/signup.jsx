import { Link } from "react-router-dom";
import AuthLayout from "../components/authLayout";

function Signup() {
  return (
    <AuthLayout>
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280]"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-extrabold text-[#3f6f4f]"> Create an account </h1>

      <p className="mt-3 text-sm text-[#6b7280]"> Join the community.</p>

      <form className="mt-6 space-y-2">
        <div>
          <label className="text-sm font-bold text-[#111827]"> Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            className="mt-2 h-9 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#111827]">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter your username"
            className="mt-2 h-9 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#111827]">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="mt-2 h-9 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-[#111827]">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
            className="mt-2 h-9 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </div>

        <p className="text-xs leading-6 text-[#6b7280]">
          By signing up, you agree to our{" "}
          <span className="font-bold text-[#3f6f4f]">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="font-bold text-[#3f6f4f]">
            Privacy Policy
          </span>.
        </p>

        <button
          type="button"
          className="h-10 w-full rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-[#6b7280]">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-[#3f6f4f]">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;