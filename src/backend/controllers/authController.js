const supabase = require("../config/supabaseClient");

async function login(req, res) {
  const { emailOrUsername, password } = req.body;

  let email = emailOrUsername;

  // determine email or username login
  if (!emailOrUsername.includes("@up.edu.ph")) {

    // gets email via username since supabase only accepts email login
    const { data: userData, error: lookUpError } = await supabase
      .from("users")
      .select("email")
      .eq("username", emailOrUsername)
      .single();

    if (lookUpError || !userData) {
      return res.status(404).json({ error: "No account found with that username." });
    }

    email = userData.email;
  }

  // sign in with supabase auth
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return res.status(401).json({ error: "Invalid email/username or password." });
  }

  // fetch user data
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, email, username, display_name, avatar_url, role, bio")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return res.status(500).json({ error: "Could not load user profile." });
  }

  return res.status(200).json({ user: profile });
}

async function signup(req, res) {
  const { email, username, password } = req.body;

  // create auth user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return res.status(400).json({ error: signUpError.message });
  }

  // insert user record
  const { error: insertError } = await supabase
    .from("users")
    .insert({
      id: data.user.id,
      email: email,
      display_name: username,
      username: username,
      avatar_url: null,
      bio: null,
      role: "user",
      password: password,
    });

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(200).json({ success: true });
}

async function changePassword(req, res) {
  try {
    const { newPassword } = req.body;

    // 1. Validation check
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long." 
      });
    }

    // 2. Extract authorization header token sent from React frontend
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];

    // 3. Request Supabase to update the password using the user's active token context
    const { error } = await supabase.auth.updateUser(
      { password: newPassword },
      { accessToken: token }
    );

    if (error) throw error;

    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("[Backend Password Change Error]:", error.message);
    return res.status(500).json({ error: error.message || "Internal server error." });
  }
}

module.exports = { login, signup, changePassword };
