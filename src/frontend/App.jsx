import { useAuth } from "./utils/authUtils"; // Import hook

function App() {
  // All the logic moved to authUtils is now just this one line
  const { user, authReady, setUser } = useAuth();

  // Wait for Supabase to indicate if a session exists before showing pages
  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center font-bold">
        Initializing Freedom Wall...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ... Keep all <Route> components exactly as they are ... */}
        {/* (They will continue to work because they use the 'user' variable) */}
      </Routes>
    </BrowserRouter>
  );
}