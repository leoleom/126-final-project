import treesImage from "../public/ll-trees.png";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#cad9d0_0%,transparent_32%),linear-gradient(135deg,#e4ebe6_0%,#dbe6df_48%,#e8e8df_100%)] text-[#2F3A35]">
      <div className="mx-auto flex min-h-screen max-w-[1700px] items-center gap-10 px-8 py-8">
        <section className="hidden flex-[0.85] lg:block">
          <div className="relative h-[82vh] min-h-[780px] overflow-hidden rounded-[2.5rem] border border-white/30 shadow-[0_20px_60px_rgba(32,58,42,0.22)]">
            <img
              src={treesImage}
              alt="Campus trees"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#13291D]/82 via-[#13291D]/25 to-transparent" />

            <div className="absolute bottom-14 left-12 right-12 text-white">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/85">
                Better Better UPV
              </p>

              <h1 className="max-w-md text-5xl font-bold leading-[1.08]">
                A safe space for honest conversations.
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-white/85">
                Share thoughts, ask questions, and connect with the community
                with care.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-[1.15] items-center justify-center">
          <div className="w-full max-w-[500px] rounded-[2rem] border border-white/35 bg-[#eef3ee]/75 p-14 shadow-[0_20px_50px_rgba(32,58,42,0.10)] backdrop-blur-xl">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;