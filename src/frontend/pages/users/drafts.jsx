import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import TopBar from "../../components/topBar";
import PostCard from "../../components/postCard";

function Drafts({ user }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchDrafts();
  }, [user]);

  async function fetchDrafts() {
    setLoading(true);

    try {
      const response = await fetch( `http://localhost:5000/api/users/${user.id}/drafts`);
      const data = await response.json();
      // console.log("draft backend data:", data);
      setDrafts(data);
    } catch (error) {
      console.error("Error fetching drafts:", error);
    }
    setLoading(false);
  }

  function formatTimeAgo(createdAt) {
    const now = new Date();
    const postDate = new Date(createdAt);
    const seconds = Math.floor((now - postDate) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <Navbar user={user} />

        <div className="grid grid-rows-[112px_1fr]">
          <TopBar user={user} searchQuery="" setSearchQuery={() => {}} />

          <main className="px-9 py-10">
            <h1 className="text-3xl font-extrabold">Drafts</h1>

            <div className="mt-8 space-y-4">
              {loading && (
                <p className="text-sm font-semibold text-[#6b7280]">
                  Loading drafts...
                </p>
              )}

              {!loading && drafts.length === 0 && (
                <section className="rounded-xl border border-[#e5e7eb] bg-white p-7">
                  <p className="text-sm font-semibold text-[#6b7280]">
                    Unpublished posts will appear here.
                  </p>
                </section>
              )}

              {drafts.map((draft) => (
                <PostCard
                  key={draft.id}
                  id={draft.id}
                  username={`@${user.username ?? user.display_name}`}
                  profilePicture={user.avatar_url}
                  time={formatTimeAgo(draft.created_at)}
                  title={draft.title || "Untitled draft"}
                  body={draft.content ?? ""}
                  tags={draft.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? []}
                  likes={0}
                  views={0}
                  isDraft={true}
                  onLike={() => {}}
                  onView={() => navigate(`/posts/${draft.id}/edit`)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Drafts;