import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar";
import TopBar from "../../components/topBar";
import PostCard from "../../components/postCard";
import { toggleBookmark, reportPost, getUserBookmarks, } from "../../utils/apiUtils";

function Bookmarks({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  async function loadBookmarks() {
    if (!user) return;

    setLoading(true);

    try {
      const { ok, data } = await getUserBookmarks(user.id);

      if (!ok) {
        toast.error("Unable to load bookmarks.");
        setBookmarkedPosts([]);
        return;
      }

      const shaped = (data || [])
        .map((bookmark) => bookmark.post)
        .filter(Boolean)
        .map((post) => ({
          id: post.id,
          authorId: post.author_id,
          username: post.is_anonymous
            ? "Anonymous"
            : `@${post.author?.username ?? post.author?.display_name ?? "unknown"}`,
          profilePicture: post.is_anonymous ? null : post.author?.avatar_url,
          createdAt: post.created_at,
          title: post.title,
          body: post.content,
          tags:
            post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [],
          likes:
            post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0,
          likedByUser:
            post.votes?.some(
              (v) => v.vote_type === "upvote" && v.author_id === user.id
            ) ?? false,
          bookmarkedByUser: true,
          views: post.views ?? 0,
          comments: post.comments?.length ?? 0,
        }));

      setBookmarkedPosts(shaped);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load bookmarks.");
      setBookmarkedPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveBookmark(postId) {
    if (!user) {
      toast.error("Please log in to manage bookmarks.");
      return;
    }

    try {
      const { ok } = await toggleBookmark(postId, user.id);

      if (!ok) {
        toast.error("Unable to remove bookmark.");
        return;
      }

      setBookmarkedPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Removed from bookmarks.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to remove bookmark.");
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

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1680px] bg-[#e6ece7]/80 shadow-[0_20px_60px_rgba(63,111,79,0.12)] transition-all duration-300 ${
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
          <TopBar user={user} searchQuery="" setSearchQuery={() => {}} />

          <main className="min-w-0 px-6 py-8 xl:px-10 2xl:px-14">
            <div className="mx-auto max-w-[1120px]">
              <section className="rounded-[2rem] bg-[#eef3ef] px-8 py-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#3F6F4F]">
                  Saved Posts
                </p>

                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#26322B] sm:text-4xl">
                      Bookmarks
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5F6B63]">
                      Posts you saved for later will appear here.
                    </p>
                  </div>

                  <div className="w-fit rounded-2xl border border-[#d4ddd6] bg-[#dfe8e2] px-5 py-3 text-sm font-bold text-[#3F6F4F]">
                    {bookmarkedPosts.length} saved
                  </div>
                </div>
              </section>

              <div className="mt-8 space-y-6">
                {loading && <LoadingCards />}

                {!loading && bookmarkedPosts.length === 0 && (
                  <section className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-10 text-center shadow-[0_12px_30px_rgba(63,111,79,0.08)]">
                    <h2 className="text-xl font-bold text-[#26322B]">
                      No bookmarks yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5F6B63]">
                      Saved posts will appear here.
                    </p>
                  </section>
                )}

                {!loading &&
                  bookmarkedPosts.map((post) => (
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
                        showViews={false}
                        showLikes={false}
                        showComments={false}
                        bookmarkedByUser={true}
                        onLike={() => {}}
                        onBookmark={() => handleRemoveBookmark(post.id)}
                        onView={() => {}}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </main>
        </div>
      </div>
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

export default Bookmarks;