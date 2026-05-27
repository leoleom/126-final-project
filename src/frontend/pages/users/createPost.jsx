import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "trix/dist/trix.css";
import "trix";
import { getTags, savePost, deletePost } from "../../utils/apiUtils";
import ConfirmDialog from "../../components/confirmDialog";

function CreatePost({ user, existingPost = null }) {
  const navigate = useNavigate();
  const isEditing = existingPost !== null;
  const isDraft = existingPost?.status === "draft";

  const [title, setTitle] = useState(existingPost?.title ?? "");
  const [content, setContent] = useState(existingPost?.content ?? "");
  const [isAnonymous, setIsAnonymous] = useState(
    existingPost?.is_anonymous ?? false
  );
  const [selectedTags, setSelectedTags] = useState(
    existingPost?.post_tags?.map((pt) => pt.tags.name) ?? []
  );

  const [availableTags, setAvailableTags] = useState([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const editorRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await getTags();
        setAvailableTags(data.map((tag) => tag.name));
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to load tags.");
      }
    }

    fetchTags();
  }, []);

  useEffect(() => {
    if (existingPost?.content && editorRef.current) {
      editorRef.current.editor.loadHTML(existingPost.content);
    }
  }, [existingPost]);

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
      editor.removeEventListener(
        "trix-attachment-remove",
        handleAttachmentRemove
      );
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
      toast.error("Upload failed.");
    }
  };

  // ── TAG HANDLERS ─────────────────────────────────────────
  function handleAddTag(tag) {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }

    setShowTagPicker(false);
  }

  function handleRemoveTag(tag) {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }

  // ── VALIDATION ───────────────────────────────────────────
  function validate() {
    if (!title.trim()) {
      toast.error("Please add a title.");
      return false;
    }

    if (!content.trim()) {
      toast.error("Please write something in your post.");
      return false;
    }

    return true;
  }

  // ── PUBLISH ──────────────────────────────────────────────
  async function handlePublish() {
    if (!validate()) return;

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
        toast.error(data.error ?? "Failed to publish post.");
        setLoading(false);
        return;
      }

      toast.success(
        isEditing && !isDraft ? "Changes saved." : "Post published."
      );
      navigate("/feed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish post.");
    }

    setLoading(false);
  }

  // ── SAVE DRAFT ───────────────────────────────────────────
  async function handleSaveDraft() {
    if (!title.trim() && !content.trim()) {
      toast.error("Write something before saving a draft.");
      return;
    }

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
        toast.error(data.error ?? "Failed to save draft.");
        setLoading(false);
        return;
      }

      toast.success("Draft saved.");
      navigate("/drafts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft.");
    }

    setLoading(false);
  }

  // ── DELETE DRAFT ─────────────────────────────────────────
  async function handleDeletePost() {
    setLoading(true);

    try {
      const { ok, data } = await deletePost(existingPost.id);

      if (!ok) {
        toast.error(data.error ?? "Failed to delete draft.");
        setLoading(false);
        return;
      }

      toast.success(isDraft ? "Draft deleted." : "Post deleted.");
      navigate(isDraft ? "/drafts" : "/feed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete draft.");
    }

    setLoading(false);
  }

  // ── CANCEL ───────────────────────────────────────────────
  function handleCancel() {
    if (!title.trim() && !content.trim()) {
      navigate(isEditing ? "/feed" : "/drafts");
      return;
    }

    setShowCancelConfirm(true);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] px-4 py-6 text-[#1f2937] sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-[1080px] rounded-[2rem] bg-[#eef3ef] px-5 py-6 shadow-[0_20px_60px_rgba(63,111,79,0.12)] sm:px-8 lg:px-12">
        {/* Header */}
        <header className="border-b border-[#d4ddd6] pb-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="w-fit rounded-xl border border-[#d4ddd6] bg-[#edf2ee] px-5 py-2.5 text-sm font-extrabold text-[#4F5C55] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              Cancel
            </button>

            <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-5 py-2.5 text-sm font-bold text-[#26322B]">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 accent-[#3F6F4F]"
              />
              Post anonymously
            </label>

            <div className="flex flex-wrap gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="h-11 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-extrabold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {isDraft ? "Delete Draft" : "Delete Post"}
                </button>
              )}

              {(!isEditing || isDraft) && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="h-11 rounded-xl border border-[#d4ddd6] bg-[#edf2ee] px-5 text-sm font-extrabold text-[#26322B] transition hover:bg-[#f4f7f4] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Draft"}
                </button>
              )}

              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="h-11 rounded-xl bg-[#3F6F4F] px-7 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(32,58,42,0.16)] transition hover:bg-[#335C41] disabled:opacity-50"
              >
                {loading
                  ? "Publishing..."
                  : isEditing && !isDraft
                  ? "Save Changes"
                  : "Publish"}
              </button>
            </div>
          </div>
        </header>

        

        {/* Title */}
        <section className="mt-8">
          <label className="text-sm font-extrabold text-[#26322B]">
            Post Title
          </label>

          <input
            type="text"
            placeholder="Write your title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3 h-12 w-full min-w-0 rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] px-4 text-sm text-[#26322B] outline-none transition placeholder:text-[#8F9892] focus:border-[#3F6F4F] focus:ring-2 focus:ring-[#3F6F4F]/20"
          />
        </section>

        {/* Tags */}
        <section className="mt-8">
          <label className="text-sm font-extrabold text-[#26322B]">
            Tags
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex h-9 items-center gap-2 rounded-full bg-[#dfe8e2] px-4 text-xs font-bold text-[#3F6F4F]"
              >
                {tag}

                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="transition hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTagPicker(!showTagPicker)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4ddd6] bg-[#f4f7f4] text-lg font-bold text-[#3F6F4F] transition hover:bg-white"
              >
                +
              </button>

              {showTagPicker && (
                <div className="absolute left-0 top-12 z-10 w-52 overflow-hidden rounded-xl border border-[#d4ddd6] bg-white shadow-[0_14px_35px_rgba(63,111,79,0.12)]">
                  {availableTags
                    .filter((tag) => !selectedTags.includes(tag))
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#26322B] transition hover:bg-[#f4f7f4]"
                      >
                        {tag}
                      </button>
                    ))}

                  {availableTags.filter((tag) => !selectedTags.includes(tag))
                    .length === 0 && (
                    <p className="px-4 py-3 text-xs text-[#8F9892]">
                      All tags selected
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content — Trix editor */}
        <section className="mt-8 min-w-0">
          <label className="text-sm font-extrabold text-[#26322B]">
            Write your post...
          </label>

          <input
            id="trix-post-input"
            ref={inputRef}
            type="hidden"
            name="content"
          />

          <div className="mt-3 min-w-0 overflow-x-auto">
            <trix-editor
              ref={editorRef}
              input="trix-post-input"
              placeholder="Share your thoughts..."
              class="min-h-56 w-full min-w-0 rounded-xl border border-[#d4ddd6] bg-[#f4f7f4] p-6 text-sm outline-none focus:border-[#3f6f4f]"
            />
          </div>
        </section>
        <ConfirmDialog
          open={showDeleteConfirm}
          title={`Delete this ${isDraft ? "draft" : "post"}?`}
          message="This cannot be undone."
          confirmText="Yes, delete"
          cancelText="Keep it"
          danger
          loading={loading}
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeleteConfirm(false)}
        />

        <ConfirmDialog
          open={showCancelConfirm}
          title="Discard changes?"
          message="Any unsaved edits will be lost."
          confirmText="Discard changes"
          cancelText="Keep editing"
          danger
          onConfirm={() => navigate(isEditing ? "/feed" : "/drafts")}
          onCancel={() => setShowCancelConfirm(false)}
        />
      </main>
    </div>
  );
}

export default CreatePost;