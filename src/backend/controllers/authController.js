// Acutal logic: import supabaseClient to log the user in

const supabase = require('../config/supabaseClient');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tell Supabase to attempt a login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    // Send success back to the frontend
    res.status(200).json({ message: "Login successful!", user: data.user });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};