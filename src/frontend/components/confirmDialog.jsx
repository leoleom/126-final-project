import { createPortal } from "react-dom";

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 px-4 pointer-events-auto">
      <div className="w-full max-w-md rounded-[1.5rem] border border-[#d4ddd6] bg-[#f8fbf8] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <h2 className="text-xl font-bold text-[#26322B]">{title}</h2>

        <p className="mt-3 text-sm leading-6 text-[#5F6B63]">
          {message}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-[#d4ddd6] bg-[#edf2ee] px-5 py-2 text-sm font-bold text-[#3F6F4F] transition hover:bg-[#f4f7f4] disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-5 py-2 text-sm font-bold text-white transition disabled:opacity-60 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#3F6F4F] hover:bg-[#335C41]"
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmDialog;