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
    .select("id, email, username, avatar_url, role")
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

module.exports = { login, signup };