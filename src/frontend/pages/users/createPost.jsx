import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "trix/dist/trix.css";
import "trix";
import { getTags, savePost, deletePost } from "../../utils/apiUtils";

function CreatePost({ user, existingPost = null }) {
  const navigate = useNavigate();
  const isEditing = existingPost !== null;
  const isDraft = existingPost?.status === "draft";

  const [title, setTitle] = useState(existingPost?.title ?? "");
  const [content, setContent] = useState(existingPost?.content ?? "");
  const [isAnonymous, setIsAnonymous] = useState(existingPost?.is_anonymous ?? false);
  const [selectedTags, setSelectedTags] = useState(existingPost?.post_tags?.map((pt) => pt.tags.name) ?? []);

  const [availableTags, setAvailableTags] = useState([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await getTags();
        setAvailableTags(data.map((t) => t.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

  useEffect(() => {
    if (existingPost?.content && editorRef.current) {
      editorRef.current.editor.loadHTML(existingPost.content);
    }
  }, []);

  const editorRef = useRef(null);
  const inputRef = useRef(null);

  // ── TRIX SETUP ───────────────────────────────────────────
  useEffect(() => {
    const editor = editorRef.current;
    const input = inputRef.current;
    if (!editor || !input) return;

    const handleAttachmentAdd = (e) => {
      if (e.attachment.file) uploadFile(e.attachment);
    };
    const handleAttachmentRemove = (e) => {
      console.log("Attachment removed:", e.attachment);
    };

    // Sync trix content into our content state
    const handleChange = () => {
      setContent(input.value);
    };

    editor.addEventListener("trix-attachment-add", handleAttachmentAdd);
    editor.addEventListener("trix-attachment-remove", handleAttachmentRemove);
    editor.addEventListener("trix-change", handleChange);

    return () => {
      editor.removeEventListener("trix-attachment-add", handleAttachmentAdd);
      editor.removeEventListener("trix-attachment-remove", handleAttachmentRemove);
      editor.removeEventListener("trix-change", handleChange);
    };
  }, []);

  const uploadFile = async (attachment) => {
    const formData = new FormData();
    formData.append("file", attachment.file);
    try {
      const res = await fetch("/upload", { method: "POST", body: formData });
      const data = await res.json();
      attachment.setAttributes({ url: data.url, href: data.url });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // ── TAG HANDLERS ─────────────────────────────────────────
  function handleAddTag(tag) {
    if (!selectedTags.includes(tag)) setSelectedTags([...selectedTags, tag]);
    setShowTagPicker(false);
  }

  function handleRemoveTag(tag) {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }

  // ── VALIDATION ───────────────────────────────────────────
  function validate() {
    if (!title.trim()) { setError("Please add a title."); return false; }
    if (!content.trim()) { setError("Please write something in your post."); return false; }
    return true;
  }

  // ── PUBLISH ──────────────────────────────────────────────
  async function handlePublish() {
    if (!validate()) return;

    setError("");
    setLoading(true);

    try {
      const { ok, data } = await savePost(existingPost?.id ?? null, {
        author_id: user.id,
        title,
        content,
        is_anonymous: isAnonymous,
        status:
          existingPost?.status === "live"
            ? "live"
            : isAnonymous
              ? "pending"
              : "live",
        selectedTags,
      });

      if (!ok) {
        setError(data.error ?? "Failed to publish post");
        setLoading(false);
        return;
      }

      navigate("/feed");
    } catch (error) {
      console.error(error);
      setError("Failed to publish post");
    }

    setLoading(false);
  }

  // ── SAVE DRAFT ───────────────────────────────────────────
  async function handleSaveDraft() {
    if (!title.trim() && !content.trim()) {
      setError("Write something before saving a draft.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { ok, data } = await savePost(existingPost?.id ?? null, {
        author_id: user.id,
        title,
        content,
        is_anonymous: isAnonymous,
        status: "draft",
        selectedTags,
      });

      if (!ok) {
        setError(data.error ?? "Failed to save draft");
        setLoading(false);
        return;
      }

      navigate("/drafts");
    } catch (error) {
      console.error(error);
      setError("Failed to save draft");
    }

    setLoading(false);
  }

  // ── DELETE DRAFT ─────────────────────────────────────────
  async function handleDeletePost() {
    setLoading(true);
    try {
      const { ok, data } = await deletePost(existingPost.id);

      if (!ok) {
        setError(data.error ?? "Failed to delete draft");
        setLoading(false);
        return;
      }

      navigate(isDraft ? "/drafts" : "/feed");
    } catch (error) {
      console.error(error);
      setError("Failed to delete draft");
    }
    setLoading(false);
  }

  // ── CANCEL ───────────────────────────────────────────────
  function handleCancel() {
    if (!title.trim() && !content.trim()) {
      navigate(isEditing ? "/drafts" : "/feed");
      return;
    }
    const leave = window.confirm("Discard changes? Any unsaved edits will be lost.");
    if (leave) navigate(isEditing ? "/drafts" : "/feed");
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] px-10 py-10 text-[#1f2937]">
      <main className="mx-auto max-w-[980px] rounded-xl bg-white px-16 py-12">

        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm font-extrabold text-[#374151] hover:text-red-500"
          >
            ← Cancel
          </button>

          <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Post anonymously
          </label>

          <div className="flex gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="flex h-11 w-32 items-center justify-center rounded-lg border border-red-200 text-sm font-extrabold text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                {isDraft ? "Delete Draft" : "Delete Post"}
              </button>
            )}
            {!isEditing || isDraft ?
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex h-11 w-32 items-center justify-center rounded-lg border border-[#e5e7eb] text-sm font-extrabold disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Draft"}
              </button>
            :
              <></>
            }

            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="h-11 w-28 rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white disabled:opacity-50"
            >
              {loading ? "Publishing..." : isEditing && !isDraft ? "Save Changes" : "Publish"}
            </button>
          </div>
        </header>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Delete confirmation banner */}
        {showDeleteConfirm && (
          <div className="mt-6 flex items-center gap-4 rounded-lg border border-red-200 bg-red-50 px-6 py-4">
            <p className="flex-1 text-sm font-semibold text-red-600">
              Are you sure you want to delete this
              {isDraft ? " draft" : " post"}?
              This cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDeletePost}
              disabled={loading}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-extrabold text-white disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-extrabold text-red-500"
            >
              Keep it
            </button>
          </div>
        )}

        {/* Title */}
        <section className="mt-16">
          <label className="text-sm font-extrabold">Post Title</label>
          <input
            type="text"
            placeholder="Write your title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3 h-12 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </section>

        {/* Tags */}
        <section className="mt-10">
          <label className="text-sm font-extrabold">Tags</label>
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex h-8 items-center gap-2 rounded-lg bg-[#e6f0ea] px-4 text-xs font-bold text-[#3f6f4f]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTagPicker(!showTagPicker)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-lg font-bold text-[#3f6f4f] hover:bg-[#e6f0ea]"
              >
                +
              </button>

              {showTagPicker && (
                <div className="absolute left-0 top-10 z-10 w-48 rounded-lg border border-[#e5e7eb] bg-white shadow-md">
                  {availableTags.filter((tag) => !selectedTags.includes(tag)).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-[#f3f4f6]"
                    >
                      {tag}
                    </button>
                  ))}
                  {availableTags.filter((tag) => !selectedTags.includes(tag)).length === 0 && (
                    <p className="px-4 py-2 text-xs text-[#9ca3af]">All tags selected</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content — Trix editor */}
        <section className="mt-10">
          <label className="text-sm font-extrabold">Write your post...</label>
          <input id="trix-post-input" ref={inputRef} type="hidden" name="content" />
          <trix-editor
            ref={editorRef}
            input="trix-post-input"
            placeholder="Share your thoughts..."
            class="mt-3 w-full min-h-56 rounded-lg border border-[#e5e7eb] p-6 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </section>

      </main>
    </div>
  );
}

export default CreatePost;