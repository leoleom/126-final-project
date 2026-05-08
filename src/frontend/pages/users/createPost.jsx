import { Link } from "react-router-dom";

import { useEffect, useRef } from "react";
import "trix/dist/trix.css";
import "trix"

function CreatePost() {
  const editorRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    const input = inputRef.current;
    if(!editor || !input) return;

    const handleAttachmentAdd = (e) => {
      const attachment = e.attachment;
      if (attachment.file){
        uploadFile(attachment);
      }
    }

    const handleAttachmentRemove = (e) => {
      console.log("Attachment removed:", e.attachment);
      // delete file from server code
    }

    editor.addEventListener("trix-attachment-add", handleAttachmentAdd);
    editor.addEventListener("trix-attachment-remove", handleAttachmentRemove);

    return () => {
      editor.removeEventListener("trix-attachment-add", handleAttachmentAdd);
      editor.removeEventListener("trix-attachment-remove", handleAttachmentRemove);
    };
  }, []);

  const uploadFile = async(attachment) => {
    const formData = new FormData();
    formData.append("file", attachment.file);

    try{
      const res = await fetch("/upload", {method: "POST", body: formData});
      const data = await res.json();

      attachment.setAttributes({
        url: data.url,
        href: data.url
      });

    // { "url": "https://your-storage.com/files/image.png" }
    // backend endpoint should return JSON like above

    } catch (err){
      console.error("Upload failed:", err);
    }
  }

  const handlePublish = () => {
    const content = inputRef.current?.value;
    console.log("Publishing:", content);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f7] px-10 py-10 text-[#1f2937]">
      <main className="mx-auto max-w-[980px] rounded-xl bg-white px-16 py-12">
        <header className="flex items-center justify-between">
          <Link to="/feed" className="text-sm font-extrabold text-[#374151]">
            ← Back
          </Link>

          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" />
            Post anonymously
          </label>

          <div className="flex gap-6">
            <Link
              to="/feed"
              className="flex h-11 w-28 items-center justify-center rounded-lg border border-[#e5e7eb] text-sm font-extrabold"
            >
              Cancel
            </Link>

            <button className="h-11 w-28 rounded-lg bg-[#3f6f4f] text-sm font-extrabold text-white">
              Publish
            </button>
          </div>
        </header>

        <section className="mt-16">
          <label className="text-sm font-extrabold">Post Title</label>
          <input
            type="text"
            placeholder="Write your title here..."
            className="mt-3 h-12 w-full rounded-lg border border-[#e5e7eb] px-4 text-sm outline-none focus:border-[#3f6f4f]"
          />
        </section>

        <section className="mt-10">
          <label className="text-sm font-extrabold">Tags</label>

          <div className="mt-4 flex gap-6">
            {["academics", "students", "rant"].map((tag) => (
              <span
                key={tag}
                className="flex h-8 w-40 items-center justify-between rounded-lg bg-[#e6f0ea] px-4 text-xs font-bold text-[#3f6f4f]"
              >
                {tag}
                <button>x</button>
              </span>
            ))}

            <button className="text-lg font-bold text-[#3f6f4f]">+</button>
          </div>
        </section>

        <section className="mt-10">
          <label className="text-sm font-extrabold">Write your post...</label>
          
            <input id="trix-post-input" ref={inputRef} type="hidden" name="content"/>
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
