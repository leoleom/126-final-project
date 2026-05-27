import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/navbar";
import TopBar from "../components/topBar";
import { getPostById, getComments, createComment, toggleVote, incrementPostView } from "../utils/apiUtils";

function ExpandedPost({ user }) {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [authorPostCount, setAuthorPostCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    setError("");

    try {
      const { ok, data } = await getPostById(id);

      if (!ok) {
        setError("Post not found.");
        return;
      }

      setPost(data.post);
      setAuthorPostCount(data.authorPostCount);

      const viewedKey = `viewed-post-${id}`;
      const lastViewedAt = Number(sessionStorage.getItem(viewedKey));
      const now = Date.now();
      const cooldown = 30 * 1000;

      if (!lastViewedAt || now - lastViewedAt > cooldown) {
        sessionStorage.setItem(viewedKey, String(now));

        incrementPostView(id)
          .then(async ({ ok }) => {
            if (!ok) return;
            const refreshed = await getPostById(id);

            if (refreshed.ok) {
              setPost(refreshed.data.post);
            }
          })
          .catch((error) => {
            console.error("View increment failed:", error);
          });
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load post.");
      toast.error("Failed to load post.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments() {
    try {
      const { ok, data } = await getComments(id);

      if (!ok) {
        toast.error("Failed to load comments.");
        setComments([]);
        return;
      }

      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments.");
      setComments([]);
    }
  }

  async function handleAddComment() {
    if (!user) {
      toast.error("Please log in to comment.");
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);

    try {
      const { ok, data } = await createComment(id, user.id, newComment);

      if (!ok) {
        toast.error(data.error || "Failed to post comment.");
        setCommentLoading(false);
        return;
      }

      setNewComment("");
      toast.success("Comment posted.");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment.");
    }

    setCommentLoading(false);
  }

  async function handleLike() {
    if (!user || !post) {
      toast.error("Please log in to like posts.");
      return;
    }

    try {
      const { ok, data } = await toggleVote(post.id, user.id);

      if (!ok) {
        toast.error(data.error || "Unable to update reaction.");
        return;
      }

      setPost((prev) => {
        if (!prev) return prev;

        let updatedVotes = [...(prev.votes ?? [])];

        if (data.liked) {
          updatedVotes.push({
            vote_type: "upvote",
            author_id: user.id,
          });
        } else {
          updatedVotes = updatedVotes.filter(
            (v) => !(v.author_id === user.id && v.vote_type === "upvote")
          );
        }

        return { ...prev, votes: updatedVotes };
      });
    } catch (error) {
      console.error("Like failed:", error);
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

  function formatJoinDate(createdAt) {
    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-sm font-semibold text-[#5F6B63]">
        Loading post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#26322B]">
        <div className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-10 text-center shadow-[0_12px_30px_rgba(63,111,79,0.08)]">
          <h1 className="text-2xl font-bold">Post not found.</h1>
          <Link
            to="/feed"
            className="mt-4 inline-block text-sm font-bold text-[#3F6F4F]"
          >
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const tags = post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [];
  const likes = post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0;
  const views = post.views ?? 0;

  const likedByUser =
    post.votes?.some(
      (v) => v.vote_type === "upvote" && v.author_id === user?.id
    ) ?? false;

  const authorName = post.is_anonymous
    ? "Anonymous"
    : `@${post.author?.username ?? post.author?.display_name ?? "unknown"}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div
        className={`mx-auto grid min-h-screen max-w-[1680px] bg-[#e6ece7]/80 shadow-[0_20px_60px_rgba(63,111,79,0.12)] transition-all duration-300 ${sidebarOpen
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
          <TopBar user={user} searchQuery="" setSearchQuery={() => { }} />

          <div className="min-w-0 px-6 py-8 xl:px-10 2xl:px-14">
            <main className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 2xl:grid-cols-[minmax(0,1fr)_340px]">
              <section className="min-w-0">
                <Link
                  to="/feed"
                  className="inline-flex rounded-full border border-[#cfd8d1] bg-[#edf2ee] px-5 py-2 text-sm font-bold text-[#3F6F4F] shadow-sm transition hover:border-[#3F6F4F] hover:bg-[#f4f7f4]"
                >
                  Back to all posts
                </Link>

                <article className="mt-8 rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-6 shadow-[0_14px_35px_rgba(63,111,79,0.08)] sm:p-8">
                  <div className="flex items-center gap-4">
                    {!post.is_anonymous && post.author ? (
                      <Link to={`/profile/${post.author.id}`} className="shrink-0">
                        {post.author.avatar_url ? (
                          <img
                            src={post.author.avatar_url}
                            alt={authorName}
                            className="h-14 w-14 rounded-full object-cover transition hover:opacity-80"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-[#c5cbc7] transition hover:opacity-80" />
                        )}
                      </Link>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-[#c5cbc7]" />
                    )}

                    <div>
                      {!post.is_anonymous && post.author ? (
                        <Link
                          to={`/profile/${post.author.id}`}
                          className="text-sm font-bold text-[#26322B] transition hover:text-[#3F6F4F] hover:underline"
                        >
                          {authorName}
                        </Link>
                      ) : (
                        <p className="text-sm font-bold text-[#26322B]">
                          {authorName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#8B968F]">
                        {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>

                  <h1 className="mt-8 break-words text-3xl font-bold tracking-tight text-[#26322B]">
                    {post.title}
                  </h1>

                  {tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#dfe8e2] px-4 py-2 text-xs font-bold text-[#3F6F4F]"
                        >
                          # {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className="prose prose-sm mt-6 max-w-none break-words leading-7 text-[#374151]"
                    dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                  />

                  <div className="mt-8 flex flex-wrap gap-6 border-t border-[#d9e1db] pt-5 text-sm font-bold text-[#7f8b84]">
                    <button
                      type="button"
                      onClick={handleLike}
                      className={`transition ${likedByUser ? "text-red-500" : "hover:text-red-400"
                        }`}
                    >
                      {likes} Likes
                    </button>

                    <span>{views} Views</span>
                    <span>{comments.length} Comments</span>
                  </div>
                </article>

                <section className="mt-8 rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-6 shadow-[0_14px_35px_rgba(63,111,79,0.08)] sm:p-8">
                  <h2 className="text-lg font-bold text-[#26322B]">
                    Comments ({comments.length})
                  </h2>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 shrink-0 rounded-full bg-[#c5cbc7]" />
                    )}

                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        placeholder="Write a thoughtful comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddComment()
                        }
                        className="h-11 min-w-0 flex-1 rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-4 text-sm outline-none transition focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
                      />

                      <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="h-11 rounded-xl bg-[#3F6F4F] px-6 text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    {comments.length === 0 && (
                      <p className="rounded-xl border border-[#d4ddd6] bg-[#edf2ee] px-5 py-4 text-sm text-[#5F6B63]">
                        No comments yet. Start the conversation with care.
                      </p>
                    )}

                    {comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        username={`@${comment.author?.username ??
                          comment.author?.display_name ??
                          "unknown"
                          }`}
                        content={comment.content}
                        time={formatTimeAgo(comment.created_at)}
                        avatarUrl={comment.author?.avatar_url}
                      />
                    ))}
                  </div>
                </section>
              </section>

              <aside className="hidden space-y-8 pt-12 2xl:block">
                {!post.is_anonymous && post.author && (
                  <SideCard title="About the author">
                    <Link to={`/profile/${post.author.id}`} className="flex items-center gap-4 transition hover:opacity-80">
                      {post.author.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={authorName}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-[#c5cbc7]" />
                      )}

                      <div>
                        <p className="text-sm font-bold text-[#26322B] hover:text-[#3F6F4F] hover:underline">
                          {authorName}
                        </p>
                        <p className="text-xs text-[#5F6B63]">
                          Joined {formatJoinDate(post.author.created_at)}
                        </p>
                      </div>
                    </Link>

                    {post.author.bio && (
                      <p className="mt-5 text-sm leading-6 text-[#4F5C55]">
                        {post.author.bio}
                      </p>
                    )}

                    <div className="mt-7 rounded-xl bg-[#dfe8e2] px-4 py-3 text-center text-sm font-bold text-[#3F6F4F]">
                      {authorPostCount} Posts
                    </div>
                  </SideCard>
                )}

                {post.is_anonymous && (
                  <SideCard title="About the author">
                    <p className="text-sm leading-6 text-[#4F5C55]">
                      This post was made anonymously.
                    </p>
                  </SideCard>
                )}

                <SideCard title="Related Posts">
                  <p className="text-sm leading-6 text-[#4F5C55]">
                    Coming soon.
                  </p>
                </SideCard>
              </aside>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCard({ title, children }) {
  return (
    <section className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-7 shadow-[0_12px_30px_rgba(63,111,79,0.08)]">
      <h3 className="mb-5 text-lg font-bold text-[#26322B]">{title}</h3>
      {children}
    </section>
  );
}

function Comment({ username, content, time, avatarUrl }) {
  return (
    <article className="rounded-xl border border-[#d4ddd6] bg-[#edf2ee] p-5">
      <div className="flex flex-wrap items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#c5cbc7]" />
        )}

        <p className="text-sm font-bold text-[#26322B]">{username}</p>
        <span className="text-xs text-[#8B968F]">{time}</span>
      </div>

      <p className="mt-3 break-words text-sm leading-6 text-[#4F5C55]">
        {content}
      </p>
    </article>
  );
}

export default ExpandedPost;