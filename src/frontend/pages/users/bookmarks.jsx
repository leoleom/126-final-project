import Navbar from "../../components/navbar";
import TopBar from "../../components/topBar";


function Bookmarks({ user }) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1280px] bg-white ${
          sidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[88px_1fr]"
        }`}
      >
        <Navbar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="grid grid-rows-[112px_1fr]">
          <TopBar user={user} searchQuery="" setSearchQuery={() => {}} />

          <main className="px-9 py-10">
            <h1 className="text-3xl font-extrabold">Bookmarks</h1>

            <section className="mt-8 rounded-xl border border-[#e5e7eb] bg-white p-7">
              <p className="text-sm font-semibold text-[#6b7280]">
                Saved posts will appear here.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Bookmarks;