
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import PostCard from "../components/postCard";

function Profile({ user }) {
  const userPosts = [
    {
      id: 1,
      title: "Lf: kasama habang buhay",
      time: "2h ago",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor ultricies metus, a rhoncus felis convallis commodo.",
      tags: ["mental health", "academics", "students", "+2"],
      likes: 51,
      views: 120,
    },
    {
      id: 2,
      title: "dubai chewy cookie or ilocos empanada?",
      time: "5h ago",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      tags: ["cravings", "not pregnant"],
      likes: 126,
      views: 299,
    },
  ];

  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalViews = userPosts.reduce((sum, post) => sum + post.views, 0);
  const totalBookmarks = user?.bookmarks?.length || 34;

  const username = user?.username || "leolem";
  const displayName = user?.displayName || "Leona Blancaflor";
  const bio = user?.bio || "Ako ay may lobo. Lumipad sa langit.";

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <Navbar user={user} />

        <main>
          <section>
            <img
              src="/ll-trees.png"
              alt="Campus trees"
              className="h-48 w-full object-cover"
            />

            <div className="relative border-b border-[#e5e7eb] bg-white px-10 pb-8">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="absolute -top-16 left-10 h-32 w-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="absolute -top-16 left-10 h-32 w-32 rounded-full border-4 border-white bg-[#d1d5db]" />
              )}

              <div className="flex justify-between pt-5">
                <div className="ml-40">
                  <h1 className="text-3xl font-extrabold">@{username}</h1>

                  <p className="mt-2 text-sm font-semibold text-[#6b7280]">
                    {displayName}
                  </p>

                  <p className="mt-4 text-sm text-[#374151]">{bio}</p>
                </div>

                <Link
                  to="/settings"
                  className="mt-2 h-11 rounded-lg border border-[#e5e7eb] bg-white px-8 py-3 text-sm font-extrabold"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="ml-40 mt-8 flex gap-20 text-center">
                <ProfileStat value={totalPosts} label="Posts" />
                <ProfileStat value={totalLikes} label="Likes" />
                <ProfileStat value={totalBookmarks} label="Bookmarks" />
                <ProfileStat value={totalViews} label="Views" />
              </div>
            </div>
          </section>

          <section className="px-10 py-8">
            <h2 className="text-2xl font-extrabold">My Posts</h2>

            <div className="mt-6 space-y-5">
              {userPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-10 text-center">
                  <h3 className="text-xl font-extrabold">No posts yet</h3>

                  <p className="mt-3 text-sm text-[#6b7280]">
                    Your posts will appear here.
                  </p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    username={`@${username}`}
                    time={post.time}
                    title={post.title}
                    body={post.body}
                    tags={post.tags}
                    likes={post.likes}
                    views={post.views}
                  />
                ))
              )}
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


