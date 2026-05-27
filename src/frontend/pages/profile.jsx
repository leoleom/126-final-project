import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/navbar";
import PostCard from "../components/postCard";
import { getUserPosts, toggleVote } from "../utils/apiUtils";
import treesImage from "../public/ll-trees.png";

function Profile({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  async function fetchUserPosts() {
    setLoading(true);

    try {
      const { data } = await getUserPosts(user.id);

      const shaped = (data || []).map((post) => ({
        id: post.id,
        authorId: post.author_id,
        username: post.is_anonymous
          ? "Anonymous (You)"
          : `@${user?.username}`,
        profilePicture: post.is_anonymous ? null : user?.avatar_url,
        createdAt: post.created_at,
        title: post.title,
        body: post.content,
        tags: post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [],
        likes: post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0,
        likedByUser:
          post.votes?.some(
            (v) => v.vote_type === "upvote" && v.author_id === user?.id
          ) ?? false,
        views: post.views ?? 0,
        comments: post.comments?.length ?? 0,
      }));

      setPosts(shaped);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load profile posts.");
    }

    setLoading(false);
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

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

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

        <main className="min-w-0">
          {/* PROFILE */}
          <section className="px-6 py-8 xl:px-10">
            <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[2rem] border border-[#d4ddd6] bg-[#eef3ef] shadow-[0_18px_40px_rgba(63,111,79,0.08)]">
              {/* COVER */}
              <div className="relative h-44">
                <img
                  src={treesImage}
                  alt="Campus trees"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#1f3d2b]/20" />
              </div>

              {/* PROFILE CONTENT */}
              <div className="relative px-8 pb-8 pt-0">
                <div className="-mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Profile"
                        className="h-42 w-42 rounded-3xl border-4 border-[#eef3ef] object-cover shadow-[0_16px_35px_rgba(63,111,79,0.20)]"
                      />
                    ) : (
                      <div className="h-42 w-42 rounded-3xl border-4 border-[#eef3ef] bg-[#c5cbc7] shadow-[0_16px_35px_rgba(63,111,79,0.20)]" />
                    )}

                    <div>
                      <h1 className="text-2xl font-extrabold text-[#26322B]">
                        {user?.display_name ?? user?.username}
                      </h1>

                      <p className="mt-2 text-sm font-semibold text-[#6b756d]">
                        @{user?.username}
                      </p>

                      <p className="mt-4 max-w-xl text-sm leading-6 text-[#5F6B63]">
                        {user?.bio ?? "No bio yet."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 lg:items-end">
                    <Link to="/settings"
                      className="flex h-8 w-fit items-center justify-center rounded-xl border border-[#cfd8d1] bg-[#edf2ee] px-6 text-sm font-extrabold text-[#3F6F4F] shadow-sm transition hover:border-[#3F6F4F] hover:bg-[#f4f7f4]"
                    >
                      Edit Profile
                    </Link>

                    <div className="mt-2 grid w-full max-w-[360px] grid-cols-3 rounded-3xl px-5 py-8 shadow-sm lg:w-[360px]">
                      <ProfileStat value={posts.length} label="Posts" />
                      <ProfileStat value={totalLikes} label="Likes" />
                      <ProfileStat value={0} label="Bookmarks" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* POSTS */}
          <section className="px-6 pb-10 xl:px-10">
            <div className="mx-auto max-w-[1180px]">
              <h2 className="text-2xl font-extrabold text-[#26322B]">
                My Posts
              </h2>

              <div className="mt-6 space-y-6">
                {loading && (
                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="h-40 animate-pulse rounded-[1.5rem] bg-[#eef3ef] shadow-[0_12px_30px_rgba(63,111,79,0.08)]"
                      />
                    ))}
                  </div>
                )}

                {!loading && posts.length === 0 && (
                  <div className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-10 text-center shadow-[0_12px_30px_rgba(63,111,79,0.08)]">
                    <h3 className="text-xl font-extrabold text-[#26322B]">
                      No posts yet
                    </h3>

                    <p className="mt-3 text-sm text-[#5F6B63]">
                      Your posts will appear here.
                    </p>
                  </div>
                )}

                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-1 shadow-[0_14px_35px_rgba(63,111,79,0.08)] transition hover:-translate-y-1 hover:bg-[#f4f7f4]"
                  >
                    <PostCard
                      id={post.id}
                      username={post.username}
                      profilePicture={post.profilePicture}
                      time={post.time}
                      title={post.title}
                      body={post.body}
                      tags={post.tags}
                      likes={post.likes}
                      likedByUser={post.likedByUser}
                      onLike={() => handleLike(post.id)}
                      views={post.views}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ProfileStat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold text-[#26322B]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-[#5F6B63]">
        {label}
      </p>
    </div>
  );
}

export default Profile;