import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import TopBar from "../components/topBar";
import PostCard from "../components/postCard";
import { getPosts, getTags, toggleVote } from "../utils/apiUtils";

function Feed({user}) {
  const [activeTab, setActiveTab] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPosts();
    loadTags();
  }, []);

  async function loadTags() {
    try {
      const { ok, data } = await getTags();

      if (!ok) {
        console.warn("Tags failed to load");
        return;
      }

      const tagNames = (data || []).map((tag) =>
        typeof tag === "string" ? tag : tag.name
      );

      setAvailableTags(tagNames);
    } catch (error) {
      console.warn("Tag loading failed:", error);
      setAvailableTags([]);
    }
  }

  async function fetchPosts() {
    setLoading(true);

    try {
      const { ok, data } = await getPosts();
      console.log(data);

      if (!ok) {
        console.error("Error fetching posts:", data);
        setLoading(false);
        return;
      }

      const shaped = (data || []).map((post) => ({
        id: post.id,
        authorId: post.author_id,
        username: post.is_anonymous
          ? "Anonymous"
          : `@${post.author?.username ?? post.author?.display_name ?? "unknown"}`,
        profilePicture: post.is_anonymous ? null : post.author?.avatar_url,
        createdAt: post.created_at,
        title: post.title,
        body: post.content,
        tags: post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [],
        likes: post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0,

        likedByUser:
          post.votes?.some(
            (v) =>
              v.vote_type === "upvote" &&
              v.author_id === user?.id
          ) ?? false,
        views: 0,
      }));

      setPosts(shaped);
    } catch (error) {
      console.error("Error fetching posts:", error);
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

  async function handleLike(postId) {
    if (!user) return;

    try {
      const { ok, data } = await toggleVote(postId, user.id);

      if (!ok) {
        console.error(data.error);
        return;
      }

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;

          return {
            ...post,
            likedByUser: data.liked,
            likes: data.liked
              ? post.likes + 1
              : Math.max(post.likes - 1, 0),
          };
        })
      );
    } catch (error) {
      console.error("Vote failed:", error);
    }
  }

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((selectedTag) => selectedTag !== tag)
        : [...prev, tag]
    );
  }

  function clearTagFilters() {
    setSelectedTags([]);
  }

  const filteredPosts = posts
    .filter((post) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        post.title?.toLowerCase().includes(query) ||
        post.body?.toLowerCase().includes(query) ||
        post.username?.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (activeTab === "Popular") return b.likes - a.likes;
      if (activeTab === "Trending") return b.views - a.views;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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

                <div className="mt-5 flex gap-6 ">
                  {["Latest", "Trending", "Popular"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`h-8 rounded-lg px-8 text-sm font-extrabold cursor-pointer shadow-sm ${
                        activeTab === tab
                          ? "bg-[#e6f0ea] text-[#1f2937]"
                          : "border border-[#e5e7eb] bg-white text-[#111827]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-2 py-1 text-xs font-medium cursor-pointer shadow-sm ${
                        selectedTags.includes(tag)
                          ? "bg-[#3f6f4f] text-white"
                          : "border border-[#e5e7eb] bg-white text-[#3f6f4f]"
                      }`}
                    >
                      # {tag}
                    </button>
                  ))}

                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={clearTagFilters}
                      className="rounded-full border border-red-200 px-2 py-1 text-xs font-bold text-red-500 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="mt-3 text-sm font-semibold text-[#6b7280]">
                  {searchQuery && `· Search: ${searchQuery}`}
                  {selectedTags.length > 0 &&
                    ` · Tags: ${selectedTags.join(", ")}`}
                </div>

                <div className="mt-8 space-y-6">
                  {loading && (
                    <p className="text-sm font-semibold text-[#6b7280]">
                      Loading posts...
                    </p>
                  )}

                  {!loading && filteredPosts.length === 0 && (
                    <p className="text-sm font-semibold text-[#6b7280]">
                      No posts found.
                    </p>
                  )}

                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      username={post.username}
                      authorId={post.authorId}
                      user={user}
                      profilePicture={post.profilePicture}
                      time={formatTimeAgo(post.createdAt)}
                      title={post.title}
                      body={post.body}
                      tags={post.tags}
                      likes={post.likes}
                      likedByUser={post.likedByUser}
                      views={post.views}
                      onLike={() => handleLike(post.id)}
                      onView={() => {}}
                      onTagClick={toggleTag}
                    />
                  ))}
                </div>
              </section>
            </main>

            <aside className="border-l border-[#e5e7eb] px-7 py-12">
              <RightCard title="Community Snapshot">
                <div className="space-y-2 text-sm font-medium text-[#374151]">
                  <div className="flex justify-between">
                    <span>Total Posts</span>
                    <span>{posts.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Active Tags</span>
                    <span>{availableTags.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Filtered Results</span>
                    <span>{filteredPosts.length}</span>
                  </div>
                </div>
              </RightCard>

              <RightCard title="Before You Post">
                <div className="space-y-2">
                  {[
                    "Respect privacy and anonymity",
                    "Avoid harassment or hate speech",
                    "Keep discussions constructive",
                    "Think before posting sensitive content",
                  ].map((reminder) => (
                    <div key={reminder} className="flex gap-3">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#3f6f4f]" />
                      <p className="text-sm leading-6 text-[#374151]">
                        {reminder}
                      </p>
                    </div>
                  ))}
                </div>
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
    <section className="mb-8 rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-7 shadow-sm">
      {title && (
        <h3 className="mb-5 text-sm font-extrabold text-[#1f2937]">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export default Feed;