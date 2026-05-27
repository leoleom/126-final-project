import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar";
import TopBar from "../../components/topBar";
import PostCard from "../../components/postCard";
import { getUserDrafts, deleteDraft } from "../../utils/apiUtils";
import ConfirmDialog from "../../components/confirmDialog";

function Drafts({ user }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteDraftId, setDeleteDraftId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchDrafts();}, [user]);

  async function fetchDrafts() {
    setLoading(true);

    try {
      const { data } = await getUserDrafts(user.id);
      setDrafts(data || []);
    } catch (error) {
      console.error("Error fetching drafts:", error);
      toast.error("Unable to load drafts.");
      setDrafts([]);
    }

    setLoading(false);
  }

  async function handleDeleteDraft() {
  if (!deleteDraftId) return;
  setDeleteLoading(true);

  try {const { ok, data } = await deleteDraft(deleteDraftId);

    if (!ok) {toast.error(data?.error || "Failed to delete draft."); return;}

    setDrafts((prev) => prev.filter((draft) => draft.id !== deleteDraftId));

    toast.success("Draft deleted.");
    setDeleteDraftId(null);
  } catch (error) { console.error(error);
    toast.error("Failed to delete draft.");
  } finally {setDeleteLoading(false);}
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

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div className={`mx-auto grid min-h-screen max-w-[1720px] shadow-[0_20px_60px_rgba(63,111,79,0.12)] transition-all duration-300 ${
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

        <div className="grid min-w-0 grid-rows-[112px_1fr]">
          <TopBar user={user} searchQuery="" setSearchQuery={() => {}} />

          <main className="min-w-0 px-6 py-8 xl:px-10 2xl:px-14">
            <div className="mx-auto max-w-[1120px]">
              <section className="rounded-[2rem] bg-[#eef3ef] px-8 py-8 shadow-[0_14px_35px_rgba(63,111,79,0.08)]">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#3F6F4F]">
                  Unpublished Posts
                </p>

                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#26322B] sm:text-4xl">
                      Drafts
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5F6B63]">
                      Unpublished posts will appear here.
                    </p>
                  </div>

                  <div className="w-fit rounded-2xl border border-[#d4ddd6] bg-[#dfe8e2] px-5 py-3 text-sm font-bold text-[#3F6F4F]">
                    {drafts.length} draft{drafts.length === 1 ? "" : "s"}
                  </div>
                </div>
              </section>

              <div className="mt-8 space-y-6">
                {loading && <LoadingCards />}

                {!loading && drafts.length === 0 && (
                  <section className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-10 text-center shadow-[0_12px_30px_rgba(63,111,79,0.08)]">
                    <h2 className="text-xl font-bold text-[#26322B]">
                      No drafts yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5F6B63]">
                      Unpublished posts will appear here.
                    </p>
                  </section>
                )}

                {!loading &&
                  drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#eef3ef] p-1 shadow-[0_14px_35px_rgba(63,111,79,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4f7f4] hover:shadow-[0_18px_45px_rgba(63,111,79,0.12)]"
                    >
                      <PostCard
                        id={draft.id}
                        username={`@${
                          user?.username ?? user?.display_name ?? "unknown"
                        }`}
                        profilePicture={user?.avatar_url}
                        time={formatTimeAgo(draft.created_at)}
                        title={draft.title || "Untitled draft"}
                        body={draft.content ?? ""}
                        tags={
                          draft.post_tags
                            ?.map((pt) => pt.tags?.name)
                            .filter(Boolean) ?? []
                        }
                        likes={0}
                        views={draft.views ?? 0}
                        isDraft={true}
                        showComments={false}
                        showLikes={false}
                        showViews={false}
                        onLike={() => {}}
                        onDelete={() => setDeleteDraftId(draft.id)}
                        onView={() => navigate(`/posts/${draft.id}/edit`)}
                      />
                    </div>
                  ))}

                <ConfirmDialog
                  open={!!deleteDraftId}
                  title="Delete this draft?"
                  message="This draft will be permanently removed."
                  confirmText="Delete"
                  cancelText="Keep it"
                  danger
                  loading={deleteLoading}
                  onConfirm={handleDeleteDraft}
                  onCancel={() => setDeleteDraftId(null)}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-44 animate-pulse rounded-[1.5rem] bg-[#eef3ef] shadow-[0_12px_30px_rgba(63,111,79,0.08)]"
        />
      ))}
    </div>
  );
}

export default Drafts;