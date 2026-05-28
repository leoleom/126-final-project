import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, display_name, avatar_url, bio, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }

  return data;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function syncUser(session) {
      if (!session?.user) {
        if (isMounted) {
          setUser(null);
          setAuthReady(true);
        }
        return;
      }

      const profile = await fetchUserProfile(session.user.id);

      if (!isMounted) return;

      if (profile) {
        setUser(profile);
      } else {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: "user",
          username: session.user.email?.split("@")[0] ?? "user",
        });
      }

      setAuthReady(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, authReady, setUser };
}

// Note: Use logoutUser from apiUtils instead - it calls the backend logout endpoint
// This prevents 403 errors from calling Supabase directly without a valid session