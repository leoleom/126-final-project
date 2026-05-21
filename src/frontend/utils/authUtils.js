import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

/* Helper to fetch the full profile from the 'users' table.
    crucial for checking if a user is an Admin.*/
export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, display_name, avatar_url, role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
  return data;
}

// The useAuth Hook Manages the user state and ensures it persists on refresh.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const syncUser = async (session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    };

    // Initial check on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    // Listen for Login/Logout/Refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        syncUser(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, authReady, setUser };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error logging out:", error.message);
}