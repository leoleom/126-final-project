import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import CreatePost from "./createPost";
import { getPostById } from "../../utils/apiUtils";

function EditPost({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    setError("");

    try {
      const { ok, data } = await getPostById(id);

      if (!ok) {
        const message = data.error ?? "Post not found.";
        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }

      setPost(data.post);
    } catch (error) {
      console.error(error);
      setError("Failed to load post.");
      toast.error("Failed to load post.");
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
        <div className="rounded-[1.5rem] bg-[#eef3ef] px-8 py-6 text-sm font-bold text-[#5F6B63] shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
          Loading post...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] px-6 text-[#1f2937]">
        <div className="w-full max-w-md rounded-[1.5rem] bg-[#eef3ef] p-8 text-center shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
          <h1 className="text-2xl font-bold text-[#26322B]">
            Unable to open post
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-[#d4ddd6] bg-[#edf2ee] px-5 py-2.5 text-sm font-bold text-[#3F6F4F] transition hover:bg-[#f4f7f4]"
            >
              Go back
            </button>

            <Link
              to="/feed"
              className="rounded-xl bg-[#3F6F4F] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41]"
            >
              Go to feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CreatePost user={user} existingPost={post} />;
}

export default EditPost;