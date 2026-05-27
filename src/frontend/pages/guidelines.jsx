import { Link } from "react-router-dom";
import treesImage from "../public/ll-trees.png";

function Guidelines() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#d7dfd8_0%,#cfd8d1_45%,#dbe3dc_100%)] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-[1200px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-[2rem] bg-[#eef3ef] px-8 py-10 shadow-[0_20px_60px_rgba(63,111,79,0.12)] sm:px-12">
          <Link
            to="/feed"
            className="inline-flex rounded-full border border-[#cfd8d1] bg-[#edf2ee] px-4 py-2 text-sm font-semibold text-[#4F5C55] shadow-sm transition hover:border-[#3F6F4F] hover:text-[#3F6F4F]"
          >
            Back to Homepage
          </Link>

          <p className="mt-12 text-xs font-bold uppercase tracking-[0.24em] text-[#3F6F4F]">
            Community Standards
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#26322B]">
            Platform Guidelines
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5F6B63]">
            Better Better UPV is a space for honest conversations. To keep the
            platform safe and respectful, every post, comment, and interaction
            should follow these guidelines.
          </p>

          <div className="mt-10 space-y-5">
            <Guideline
              number="01"
              title="Respect Others"
              body="Treat other users with basic respect. Do not insult, threaten, mock, or attack someone because of their opinion, identity, or personal experience."
            />

            <Guideline
              number="02"
              title="No Hate Speech"
              body="Do not post content that degrades or targets people based on race, ethnicity, religion, gender, sexuality, disability, appearance, or background."
            />

            <Guideline
              number="03"
              title="No Harassment or Bullying"
              body="Avoid repeated hostile comments, unwanted attention, name-calling, or posts meant to shame another person. Disagreement is allowed. Abuse is not."
            />

            <Guideline
              number="04"
              title="Respect Privacy"
              body="Do not share private messages, personal information, photos, addresses, schedules, or identifying details without consent. Anonymous posts must still protect privacy."
            />

            <Guideline
              number="05"
              title="No Spam or Self-Promotion"
              body="Avoid repeated posts, irrelevant links, scams, advertisements, or promotional content that does not contribute to the community discussion."
            />

            <Guideline
              number="06"
              title="Stay on Topic"
              body="Keep posts and comments relevant to the community. Use tags properly so others can find and understand the discussion more easily."
            />

            <Guideline
              number="07"
              title="Be Honest"
              body="Share thoughts truthfully. Do not spread rumors, fake information, edited screenshots, or claims meant to mislead other users."
            />

            <Guideline
              number="08"
              title="Post With Care"
              body="Before posting sensitive experiences or serious concerns, consider whether the content may harm, expose, or unfairly target someone else."
            />
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-[#d4ddd6] bg-[#dfe8e2] p-7 text-sm leading-7 text-[#4F5C55]">
            <h2 className="font-extrabold text-[#26322B]">
              Reminder
            </h2>

            <p className="mt-2">
              Posts that violate these guidelines may be reviewed, hidden, or
              removed. Users who repeatedly break the rules may lose access to
              the platform.
            </p>
          </div>
        </section>

        <section className="hidden lg:block">
          <div className="sticky top-8 h-[calc(100vh-4rem)] overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(63,111,79,0.18)]">
            <img
              src={treesImage}
              alt="Campus trees"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#1f3d2b]/25" />
          </div>
        </section>
      </div>
    </div>
  );
}

function Guideline({ number, title, body }) {
  return (
    <section className="rounded-[1.5rem] border border-[#d4ddd6] bg-[#f4f7f4] p-6 shadow-[0_10px_24px_rgba(63,111,79,0.06)] transition hover:-translate-y-0.5 hover:bg-white">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3F6F4F] text-xs font-extrabold text-white">
          {number}
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-[#26322B]">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5F6B63]">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Guidelines;