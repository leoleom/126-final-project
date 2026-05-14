import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import TopBar from "../components/topBar";

function ExpandedPost({ user }) {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [authorPostCount, setAuthorPostCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function fetchPost() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError("Post not found.");
        setLoading(false);
        return;
      }

      setPost(data.post);
      setAuthorPostCount(data.authorPostCount);
    } catch (error) {
      console.error(error);
      setError("Failed to load post.");
    }

    setLoading(false);
  }

  async function fetchComments() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/comments`
      );
      const data = await response.json();

      setComments(data ?? []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function handleAddComment() {
    if (!user) {
      console.error("User not loaded");
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author_id: user.id,
            content: newComment,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        setCommentLoading(false);
        return;
      }

      setNewComment("");

      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }

    setCommentLoading(false);
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
      month: "long", year: "numeric",
    });
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-[#6b7280]">
      Loading post...
    </div>
  );

  if (error || !post) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8f7] text-[#1f2937]">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">Post not found.</h1>
        <Link to="/feed" className="mt-4 inline-block text-sm font-bold text-[#3f6f4f]">
          Back to feed
        </Link>
      </div>
    </div>
  );

  const tags = post.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [];
  const likes = post.votes?.filter((v) => v.vote_type === "upvote").length ?? 0;
  const authorName = post.is_anonymous
    ? "Anonymous"
    : `@${post.author?.username ?? post.author?.display_name ?? "unknown"}`;

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] grid-cols-[260px_1fr] bg-white">
        <Navbar user={user} />

        <div className="grid grid-rows-[112px_1fr]">
          <TopBar user={user} searchQuery="" setSearchQuery={() => {}} />

          <div className="px-10 py-10">
            <main className="mx-auto grid max-w-[1100px] grid-cols-[1fr_260px] gap-10">
              <section>
                <Link to="/feed" className="text-sm font-extrabold text-[#374151]">
                  ← Back to all posts
                </Link>

                {/* Post */}
                <article className="mt-8 rounded-xl border border-[#e5e7eb] bg-white p-8">
                  <div className="flex items-center gap-4">
                    {post.author?.avatar_url && !post.is_anonymous ? (
                      <img
                        src={post.author.avatar_url}
                        alt={authorName}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-[#d1d5db]" />
                    )}

                    <div>
                      <p className="text-sm font-extrabold">{authorName}</p>
                      <p className="text-xs font-semibold text-[#9ca3af]">
                        {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>

                  <h1 className="mt-8 text-2xl font-extrabold">{post.title}</h1>

                  <div className="mt-6 flex flex-wrap gap-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-[#e6f0ea] px-6 py-2 text-xs font-bold text-[#3f6f4f]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Render Trix HTML content */}
                  <div
                    className="mt-6 text-sm leading-6 text-[#374151] prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                  />

                  <div className="mt-6 flex gap-6 text-sm font-bold text-[#9ca3af]">
                    <span>{likes} Likes</span>
                    <span>{comments.length} Comments</span>
                  </div>
                </article>

                {/* Comments */}
                <section className="mt-8 rounded-xl border border-[#e5e7eb] bg-white p-8">
                  <h2 className="text-lg font-extrabold">
                    Comments ({comments.length})
                  </h2>

                  {/* Add comment */}
                  <div className="mt-6 flex gap-4">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="h-9 w-9 shrink-0 rounded-full bg-[#d1d5db]" />
                      )}
                    <div className="flex flex-1 gap-3">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                        className="h-9 flex-1 rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
                      />
                      <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={commentLoading || !newComment.trim()}
                        className="h-9 rounded-lg bg-[#3f6f4f] px-4 text-sm font-extrabold text-white disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 space-y-8">
                    {comments.length === 0 && (
                      <p className="text-sm text-[#9ca3af]">
                        No comments yet. Be the first!
                      </p>
                    )}

                    {comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        username={`@${comment.author?.username ?? comment.author?.display_name ?? "unknown"}`}
                        content={comment.content}
                        time={formatTimeAgo(comment.created_at)}
                        avatarUrl={comment.author?.avatar_url}
                      />
                    ))}
                  </div>
                </section>
              </section>

              {/* Sidebar */}
              <aside className="space-y-8 pt-12">
                {!post.is_anonymous && post.author && (
                  <section className="rounded-lg bg-[#e6f0ea] p-7">
                    <h3 className="text-lg font-extrabold">About the author</h3>

                    <div className="mt-8 flex items-center gap-4">
                      {post.author.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={authorName}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-[#d1d5db]" />
                      )}

                      <div>
                        <p className="text-sm font-extrabold">{authorName}</p>
                        <p className="text-xs text-[#6b7280]">
                          Joined {formatJoinDate(post.author.created_at)}
                        </p>
                      </div>
                    </div>

                    {post.author.bio && (
                      <p className="mt-4 text-sm text-[#374151]">{post.author.bio}</p>
                    )}

                    <p className="mt-8 text-center text-sm font-bold">
                      {authorPostCount} Posts
                    </p>
                  </section>
                )}

                {post.is_anonymous && (
                  <section className="rounded-lg bg-[#e6f0ea] p-7">
                    <h3 className="text-lg font-extrabold">About the author</h3>
                    <p className="mt-4 text-sm text-[#6b7280]">
                      This post was made anonymously.
                    </p>
                  </section>
                )}

                <section className="rounded-lg bg-[#e6f0ea] p-7">
                  <h3 className="text-lg font-extrabold">Related Posts</h3>
                  <p className="mt-4 text-sm text-[#6b7280]">Coming soon.</p>
                </section>
              </aside>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Comment({ username, content, time, avatarUrl }) {
  return (
    <article className="border-l-4 border-[#1f2937] pl-5">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-[#d1d5db]" />
        )}
        <p className="text-sm font-bold">{username}</p>
        <span className="text-xs text-[#9ca3af]">{time}</span>
      </div>

      <p className="mt-2 text-sm leading-6 text-[#374151]">{content}</p>
    </article>
  );
}

export default ExpandedPost;