import { Link } from "react-router-dom";

function Guidelines() {
  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1100px] grid-cols-[1fr_42%] bg-white">
        <section className="px-16 py-14">
          <Link to="/feed" className="text-sm font-extrabold text-[#374151]">
            ← Back to Homepage
          </Link>

          <h1 className="mt-12 text-3xl font-extrabold">
            Platform Guidelines
          </h1>

          <div className="mt-10 space-y-8">
            <Guideline
              title="1. Respect Others"
              body="Treat other users with respect. Avoid insults, harassment, or personal attacks."
            />
            <Guideline
              title="2. No Hate Speech"
              body="Do not post content that attacks people based on identity, background, or beliefs."
            />
            <Guideline
              title="3. No Spam or Self-Promotion"
              body="Avoid repeated posts, irrelevant links, or promotional content."
            />
            <Guideline
              title="4. Stay on Topic"
              body="Keep discussions relevant to the community and the topic being discussed."
            />
            <Guideline
              title="5. Be Honest"
              body="Share thoughts truthfully and avoid intentionally misleading information."
            />
          </div>

          <div className="mt-12 rounded-lg bg-[#e6f0ea] p-8 text-center text-sm font-extrabold">
            And this whole thing is a scrollable section if needed.
          </div>
        </section>

        <section className="h-screen overflow-hidden">
          <img
            src="/ll-trees.png"
            alt="Campus trees"
            className="h-full w-full object-cover"
          />
        </section>
      </div>
    </div>
  );
}

function Guideline({ title, body }) {
  return (
    <section>
      <h2 className="text-lg font-extrabold">{title}</h2>
      <p className="mt-3 max-w-[430px] text-sm leading-6 text-[#374151]">
        {body}
      </p>
    </section>
  );
}

export default Guidelines;









