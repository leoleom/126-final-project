import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/navbar";
import TopBar from "../components/topBar";
import PostCard from "../components/postCard";
import ConfirmDialog from "../components/confirmDialog";
import {getPosts, getTags, toggleVote, toggleBookmark, reportPost, getUserBookmarks,} from "../utils/apiUtils";

function Feed({ user }) {
  const [activeTab, setActiveTab] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookmarkingPostId, setBookmarkingPostId] = useState(null);
  const [reportPostId, setReportPostId] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {fetchPosts(); loadTags();}, []);

  async function loadTags() {
    try {
      const { ok, data } = await getTags();

      if (!ok) {toast.error("Unable to load tags."); return;}

      const tagNames = (data || []).map((tag) =>
        typeof tag === "string" ? tag : tag.name
      );

      setAvailableTags(tagNames);
    } catch (error) {
      console.warn("Tag loading failed:", error);
      toast.error("Tag loading failed.");
      setAvailableTags([]);
    }
  }

  async function fetchPosts() {
    setLoading(true);

    try {
      const { ok, data } = await getPosts();
      const bookmarkedPostIds = await loadBookmarkedPostIds();

      if (!ok) {
        toast.error("Unable to load conversations.");
        setLoading(false);
        return;
      }

      const shaped = (data || []).map((post) => ({
        id: post.id,
        authorId: post.author_id,
        username: post.is_anonymous
          ? "Anonymous" + (post.author_id === user?.id ? " (You)" : "")
          : `@${post.author?.username ?? post.author?.display_name ?? "unknown"}`,
        profilePicture: post.is_anonymous ? null : post.author?.avatar_url,
        createdAt: post.created_at,
        title: post.title,
        body: post.content,
        tags: post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [],
        likes: post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0,
        likedByUser: post.votes?.some((v) => v.vote_type === "upvote" && v.author_id === user?.id) ?? false,
        bookmarkedByUser: bookmarkedPostIds.has(post.id),
        views: post.views ?? 0,
        comments: post.comments?.length ?? 0,
      }));

      setPosts(shaped);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Unable to load conversations.");
    }

    setLoading(false);
  }

  async function loadBookmarkedPostIds() {
    if (!user) return new Set();

    const { ok, data } = await getUserBookmarks(user.id);

    if (!ok) {console.error("Error fetching bookmarks:", data);
      return new Set();}

    return new Set((data || []).map((bookmark) => bookmark.post?.id));
  }

  async function handleLike(postId) {
    if (!user) {toast.error("Please log in to like posts."); return;}

    try {
      const { ok, data } = await toggleVote(postId, user.id);

      if (!ok) {toast.error(data.error || "Unable to update reaction."); return;}

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          return {...post, likedByUser: data.liked, likes: data.liked ? post.likes + 1 : Math.max(post.likes - 1, 0),};
        })
      );
    } catch (error) {
      console.error("Vote failed:", error);
      toast.error("Unable to update reaction.");
    }
  }

  async function handleBookmark(postId) {
    if (!user) {toast.error("Please log in to bookmark posts."); return;}
    if (bookmarkingPostId === postId) return;

    setBookmarkingPostId(postId);

    try {
      const { ok, data } = await toggleBookmark(postId, user.id);

      if (!ok) {toast.error(data.error || "Bookmark action failed."); return;}

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, bookmarkedByUser: data.bookmarked }
            : post
        )
      );

      toast.success(
        data.bookmarked ? "Saved to bookmarks." : "Removed from bookmarks."
      );
    } catch (error) {
      console.error("Bookmark failed:", error);
      toast.error("Bookmark action failed.");
    } finally {
      setBookmarkingPostId(null);
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
    toast.success("Filters cleared.");
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

  async function handleReport() {
    if (!user) {
      toast.error("Please log in to report posts.");
      setReportPostId(null);
      return;
    }

    if (!reportPostId) return;

    setReportLoading(true);

    try {
      const { ok, data } = await reportPost(reportPostId, user.id);

      if (!ok) {
        toast.error(data?.error || "Failed to report post.");
        return;
      }

      toast.success("Post reported. Thank you for helping keep the space safe.");
      setReportPostId(null);
    } catch (error) {
      console.error("Report failed:", error);
      toast.error("Failed to report post.");
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#dbe3dc] text-[#1f2937]">
      <div
        className={`grid min-h-screen transition-all duration-300 ${
          sidebarOpen
            ? "grid-cols-[280px_minmax(0,1fr)]"
            : "grid-cols-[96px_minmax(0,1fr)]"
        }`}
      >
        <Navbar
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="grid min-w-0 grid-rows-[112px_1fr]">
          <TopBar
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="grid min-w-0 grid-cols-1 gap-8 2xl:grid-cols-[minmax(0,1fr)_340px]">
            <main className="min-w-0">
              <section className="px-6 py-8 xl:px-10 2xl:px-14">

                <div className="mt-1 flex flex-wrap gap-3">
                  {["Latest", "Trending", "Popular"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-xl px-7 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${
                        activeTab === tab
                          ? "bg-[#3F6F4F] text-white shadow-[0_10px_24px_rgba(63,111,79,0.22)]"
                          : "border border-[#cfd8d1] bg-[#edf2ee] text-[#3F6F4F] hover:border-[#3F6F4F] hover:bg-[#f4f7f4]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-4 py-2 text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                        selectedTags.includes(tag)
                          ? "bg-[#3F6F4F] text-white"
                          : "bg-[#dfe8e2] text-[#3F6F4F] hover:bg-[#edf2ee]"
                      }`}
                    >
                      # {tag}
                    </button>
                  ))}

                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={clearTagFilters}
                      className="rounded-full border border-[#e3b7b7] bg-[#f7eaea] px-4 py-2 text-xs font-semibold text-[#A85858] transition hover:bg-[#f3dddd]"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {(searchQuery || selectedTags.length > 0) && (
                  <div className="mt-5 rounded-xl border border-[#d4ddd6] bg-[#eef3ef] px-5 py-3 text-sm font-medium text-[#5F6B63] shadow-sm">
                    {searchQuery && <span>Search: {searchQuery}</span>}

                    {searchQuery && selectedTags.length > 0 && (
                      <span className="mx-2 text-[#8B968F]">/</span>
                    )}

                    {selectedTags.length > 0 && (
                      <span>Tags: {selectedTags.join(", ")}</span>
                    )}
                  </div>
                )}

                <div className="mt-8 space-y-7">
                  {loading && <LoadingCards />}

                  {!loading && filteredPosts.length === 0 && (
                    <EmptyState
                      searchQuery={searchQuery}
                      selectedTags={selectedTags}
                    />
                  )}

                  {!loading &&
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-1 shadow-[0_14px_35px_rgba(63,111,79,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4f7f4] hover:shadow-[0_18px_45px_rgba(63,111,79,0.12)]"
                      >
                        <PostCard
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
                          bookmarkedByUser={post.bookmarkedByUser}
                          views={post.views}
                          onLike={() => handleLike(post.id)}
                          comments={post.comments}
                          onBookmark={() => handleBookmark(post.id)}
                          onRequestReport={() => setReportPostId(post.id)}
                          onTagClick={toggleTag}
                        />
                      </div>
                    ))}

                    <ConfirmDialog
                      open={!!reportPostId}
                      title="Report this post?"
                      message="This will send the post to the moderators for review. Only report posts that violate the community guidelines."
                      confirmText="Report"
                      cancelText="Cancel"
                      danger
                      loading={reportLoading}
                      onConfirm={handleReport}
                      onCancel={() => setReportPostId(null)}
                    />
                </div>
              </section>
            </main>

            <aside className="hidden border-l border-[#cfd8d1] bg-[#dfe8e2] px-8 py-12 2xl:block">
              <RightCard title="Community Pulse">
                <div className="space-y-4 text-sm font-medium text-[#4F5C55]">
                  <StatRow label="Total Posts" value={posts.length} />
                  <StatRow label="Active Tags" value={availableTags.length} />
                  <StatRow label="Filtered Results" value={filteredPosts.length} />
                </div>
              </RightCard>

              <RightCard title="Gentle Reminders">
                <div className="space-y-4">
                  {[
                    "Respect privacy and anonymity",
                    "Avoid harassment or hate speech",
                    "Keep discussions constructive",
                    "Think before posting sensitive content",
                  ].map((reminder) => (
                    <div key={reminder} className="flex gap-3">
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#3F6F4F]/50" />
                      <p className="text-sm leading-6 text-[#4F5C55]">
                        {reminder}
                      </p>
                    </div>
                  ))}
                </div>
              </RightCard>

              <RightCard title="Space Check">
                <p className="text-sm leading-6 text-[#4F5C55]">
                  This space works best when people feel heard, safe, and
                  respected. Pause before posting. Choose words with care.
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
    <section className="mb-8 rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-7 shadow-[0_12px_30px_rgba(63,111,79,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4f7f4]">
      {title && (
        <h3 className="mb-5 text-sm font-bold tracking-wide text-[#26322B]">
          {title}
        </h3>
      )}

      {children}
    </section>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#dfe8e2] px-4 py-3">
      <span>{label}</span>
      <span className="font-bold text-[#3F6F4F]">{value}</span>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-44 animate-pulse rounded-[1.5rem] bg-[#eef3ef] shadow-[0_12px_30px_rgba(63,111,79,0.08)]"
        />
      ))}
    </div>
  );
}

function EmptyState({ searchQuery, selectedTags }) {
  const hasFilters = searchQuery || selectedTags.length > 0;

  return (
    <div className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-8 shadow-[0_12px_30px_rgba(63,111,79,0.08)]">
      <h3 className="text-lg font-bold text-[#26322B]">
        No conversations found
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-[#5F6B63]">
        {hasFilters
          ? "No conversations match this view yet. Try adjusting the search or selected tags."
          : "There are no posts yet. New conversations will appear here once the community starts sharing."}
      </p>
    </div>
  );
}

export default Feed;