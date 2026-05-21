import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

    try {
      const { ok, data } = await getPostById(id);

      if (!ok) {
        setError(data.error ?? "Post not found.");
        setLoading(false);
        return;
      }

      setPost(data.post);
    } catch (error) {
      console.error(error);
      setError("Failed to load post.");
    }

    setLoading(false);
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-[#6b7280]">
      Loading post...
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-red-500">
      {error}
    </div>
  );

  return <CreatePost user={user} existingPost={post} />;
}

export default EditPost;