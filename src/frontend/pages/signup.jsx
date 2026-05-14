import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/authLayout";
import { supabase } from "../services/supabaseClient";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setError("");

    if (password !== confirmPassword){
      setError("Passwords do not match.")
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!email.endsWith("@up.edu.ph")){
      setError("Only @up.edu.ph email addresses are allowed.")
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
     password
    });
  
    if (signUpError){
      setError(signUpError.message);
      setLoading(false);
      return;
    };

    const { error: insertError } = await supabase
    .from("users").insert({
      id: data.user.id,
      email: email,
      display_name: username,
      username, username,
      avatar_url: null,
      bio: null,
      role: "user",
    });

    if (insertError){
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/feed");
  }

  return (
    <AuthLayout>
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280]"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-extrabold text-[#3f6f4f]">
        Create an account
      </h1>

      <p className="mt-3 text-sm text-[#6b7280]">
        Join the community.
      </p>

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}

      <form className="mt-6 space-y-2">
        <div>
          <label className="text-sm font-bold text-[#111827]">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handleSignup}
          disabled={loading}
          className="h-10 w-full rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white"
        >
          {loading ? "Signing up..." : "Sign Up"}
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