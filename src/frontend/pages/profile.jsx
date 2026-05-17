import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import PostCard from "../components/postCard";
import { getUserPosts } from "../utils/apiUtils";

function Profile({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  async function fetchUserPosts() {
    setLoading(true);

    try {
      const { data } = await getUserPosts(user.id);
      // console.log("profile backend data:", data);

      const shaped = data.map((post) => ({
        id: post.id,
        title: post.title,
        body: post.content,
        time: formatTimeAgo(post.created_at),
        tags:
          post.post_tags
            ?.map((pt) => pt.tags?.name)
            .filter(Boolean) ?? [],
        likes:
          post.votes?.filter(
            (v) => v.vote_type === "upvote"
          ).length ?? 0,
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

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

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

        <main>
          <section>
            <img
              src="/ll-trees.png"
              alt="Campus trees"
              className="h-48 w-full object-cover"
            />

            <div className="relative border-b border-[#e5e7eb] bg-white px-10 pb-8">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="absolute -top-16 left-10 h-32 w-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="absolute -top-16 left-10 h-32 w-32 rounded-full border-4 border-white bg-[#d1d5db]" />
              )}

              <div className="flex justify-between pt-5">
                <div className="ml-40">
                  <h1 className="text-3xl font-extrabold">
                    {user?.display_name ?? user?.username}
                  </h1>

                  {user?.display_name && user?.username !== user?.display_name && (
                    <p className="mt-2 text-sm font-semibold text-[#6b7280]">
                      @{user.username}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-[#374151]">
                    {user?.bio ?? "No bio yet."}
                  </p>
                </div>

                <Link
                  to="/settings"
                  className="mt-2 h-11 rounded-lg border border-[#e5e7eb] bg-white px-8 py-3 text-sm font-extrabold"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="ml-40 mt-8 flex gap-20 text-center">
                <ProfileStat value={posts.length} label="Posts" />
                <ProfileStat value={totalLikes} label="Likes" />
                <ProfileStat value={0} label="Bookmarks" />
                <ProfileStat value={totalViews} label="Views" />
              </div>
            </div>
          </section>

          <section className="px-10 py-8">
            <h2 className="text-2xl font-extrabold">My Posts</h2>

            <div className="mt-6 space-y-5">
              {loading && (
                <p className="text-sm text-[#6b7280]">Loading posts...</p>
              )}

              {!loading && posts.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center">
                  <h3 className="text-xl font-extrabold">No posts yet</h3>
                  <p className="mt-3 text-sm text-[#6b7280]">
                    Your posts will appear here.
                  </p>
                </div>
              )}

              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  username={`@${user?.username ?? user?.display_name}`}
                  profilePicture={user.avatar_url}
                  time={post.time}
                  title={post.title}
                  body={post.body}
                  tags={post.tags}
                  likes={post.likes}
                  views={post.views}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ProfileStat({ value, label }) {
  return (
    <div>
      <p className="text-base font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-[#6b7280]">{label}</p>
    </div>
  );
}

export default Profile;