import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import TopBar from "../components/topBar";
import PostCard from "../components/postCard";
// We don't need the direct supabase import here anymore

function Feed({ user }) {
  const [activeTab, setActiveTab] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const trendingTopics = [
    "Mental Health", "Academic Pressure", "Cravings",
    "Not Pregnant", "Freedom of Speech",
  ];

  // The Debounce Effect: Watches searchQuery and fetches from backend
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(searchQuery);
    }, 500); // Waits 500ms after they stop typing to fetch

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  async function fetchPosts(query = "") {
    setLoading(true);
    try {
      // Point to your Express Backend
      const url = query 
        ? `http://localhost:5000/api/search?q=${query}` 
        : `http://localhost:5000/api/search`;

      const response = await fetch(url);
      const data = await response.json();

      const shaped = data.map((post) => ({
        id: post.id,
        username: post.is_anonymous
          ? "Anonymous"
          : `@${post.author?.username ?? post.author?.display_name ?? "unknown"}`,
        createdAt: post.created_at,
        title: post.title,
        body: post.content,
        tags: post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [],
        likes: post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0,
        views: 0,
      }));

      setPosts(shaped);
    } catch (error) {
      console.error("Error fetching posts from backend:", error);
    } finally {
      setLoading(false);
    }
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

  function handleLike(postId) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  }

  // We only sort now, the backend handles the filtering
  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === "Popular") return b.likes - a.likes;
    if (activeTab === "Trending") return b.views - a.views;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <Navbar user={user} />

        <div className="grid grid-rows-[112px_1fr]">
          <TopBar
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="grid grid-cols-[1fr_260px]">
            <main>
              <section className="px-9 py-10">
                <h2 className="text-3xl font-extrabold text-[#1f2937]">
                  All Posts
                </h2>

                <div className="mt-5 flex gap-6">
                  {["Latest", "Trending", "Popular"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`h-11 rounded-lg px-8 text-sm font-extrabold ${
                        activeTab === tab
                          ? "bg-[#e6f0ea] text-[#1f2937]"
                          : "border border-[#e5e7eb] bg-white text-[#111827]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-3 text-sm font-semibold text-[#6b7280]">
                  {searchQuery && `· Search: ${searchQuery}`}
                </div>

                <div className="mt-8 space-y-6">
                  {loading && (
                    <p className="text-sm font-semibold text-[#6b7280]">
                      Loading posts...
                    </p>
                  )}

                  {!loading && sortedPosts.length === 0 && (
                    <p className="text-sm font-semibold text-[#6b7280]">
                      No posts found.
                    </p>
                  )}

                  {/* Note: Changed filteredPosts to sortedPosts here */}
                  {sortedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      username={post.username}
                      time={formatTimeAgo(post.createdAt)}
                      title={post.title}
                      body={post.body}
                      tags={post.tags}
                      likes={post.likes}
                      views={post.views}
                      onLike={() => handleLike(post.id)}
                      onView={() => {}}
                    />
                  ))}
                </div>
              </section>
            </main>

            <aside className="border-l border-[#e5e7eb] px-7 py-32">
              <RightCard title="Trending Topics">
                <ul className="space-y-4 text-sm font-semibold text-[#6b7280]">
                  {trendingTopics.map((topic) => (
                    <li key={topic}>
                      <button
                        onClick={() => setSearchQuery(topic)}
                        className="text-left hover:text-[#3f6f4f]"
                      >
                        # {topic}
                      </button>
                    </li>
                  ))}
                </ul>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-6 block text-sm font-extrabold text-[#3f6f4f]"
                  >
                    Clear search
                  </button>
                )}
              </RightCard>

              <RightCard>
                <p className="text-l font-bold leading-6 text-[#1f2937]">
                  The truth will set you free, but first will make you uncomfortable
                </p>
                <p className="mt-4 text-sm text-[#6b7280]">— Unknown</p>
              </RightCard>

              <RightCard title="Community Reminder">
                <p className="text-sm leading-6 text-[#374151]">
                  Let's keep discussions respectful. Different opinions, one community.
                </p>
              </RightCard>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function RightCard({ title, children }) {
  return (
    <section className="mb-8 rounded-lg bg-[#e6f0ea] p-7">
      {title && (
        <h3 className="mb-6 text-lg font-extrabold text-[#1f2937]">{title}</h3>
      )}
      {children}
    </section>
  );
}

export default Feed;