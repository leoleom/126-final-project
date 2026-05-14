import treesImage from "../public/ll-trees.png";
function AuthLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#f7f8f7]">
      <section className="relative hidden w-[40%] overflow-hidden lg:block">
        <img
          src={treesImage}
          alt="Campus trees"
          className="h-[100%] w-full object-cover"
        />

        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-5xl font-extrabold">Better Better UPV</h1>
          <p className="mt-2 text-sm font-medium"> A space for honest conversations.</p>
        </div>
      </section>

      <section className="flex h-[100$] flex-1 items-center justify-center overflow-y-auto px-8 py-4">
        <div className="w-full max-w-[450px] rounded-2xl bg-white p-10 shadow-sm">
          {children}
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;