import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import CreatePost from "./createPost";

function EditDraft({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDraft();
  }, [id]);

  async function fetchDraft() {
    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        is_anonymous,
        status,
        author_id,
        post_tags (tags (name))
      `)
      .eq("id", id)
      .eq("author_id", user.id)  // security: only fetch own drafts
      .eq("status", "draft")
      .single();

    if (fetchError || !data) {
      setError("Draft not found or you don't have access to it.");
      setLoading(false);
      return;
    }

    const shaped = {
      id: data.id,
      title: data.title ?? "",
      content: data.content ?? "",
      is_anonymous: data.is_anonymous ?? false,
      tags: data.post_tags?.map((pt) => pt.tags?.name).filter(Boolean) ?? [],
    };

    setDraft(shaped);
    setLoading(false);
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-[#6b7280]">
      Loading draft...
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center text-sm text-red-500">
      {error}
    </div>
  );

  return <CreatePost user={user} existingPost={draft} />;
}

export default EditDraft;