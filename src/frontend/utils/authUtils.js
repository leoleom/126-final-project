// The useAuth Hook Manages the user state and ensures it persists on refresh.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true; // FIXED: Tracks component lifecycle to prevent memory leaks or state overrides

    const syncUser = async (session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        
        if (isMounted) {
          if (profile) {
            setUser(profile);
          } else {
            // FIXED: Reliable fallback so user state doesn't drop to null during query transitions
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: "user", 
              username: session.user.email.split("@")[0]
            });
          }
        }
      } else {
        if (isMounted) setUser(null);
      }
      
      if (isMounted) setAuthReady(true);
    };

    // 1. INITIAL SESSION CHECK: Instantly reads token from local storage on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session);
    });

    // 2. AUTOMATIC TOKEN REFRESH LISTENER: 
    // Securely hooks into logins, logouts, and background TOKEN_REFRESHED events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[Auth Event Intercepted]: ${event}`);
        await syncUser(session);
      }
    );

    return () => {
      isMounted = false; // Turn off flag on unmount
      subscription.unsubscribe();
    };
  }, []);

  return { user, authReady, setUser };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error logging out:", error.message);
}