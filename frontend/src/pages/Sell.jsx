import { Link } from "react-router-dom";
import { FilePlus2, ShieldCheck, HousePlus, House, FilePenLine, ChartNoAxesCombined } from "lucide-react";

const Sell = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10 dark:bg-[radial-gradient(circle_at_top_left,#123343_0%,#081a26_28%,#06141e_65%,#04111a_100%)]">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-[#08243f] dark:text-white">
          Sell or rent out <span className="text-[#12a77d] dark:text-[#55d4aa]">your property</span>
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-[#a7b4be]">
          Create and manage property listings after becoming an approved seller
          or real-estate agent.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 dark:border-[#234354] dark:bg-[#0b2233]/75 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]">

            <h2 className="text-xl font-semibold text-[#08243f] dark:text-white">
              How it works
            </h2>

            <div className="mt-6 flex gap-4 border-b border-gray-200 pb-5 dark:border-white/10">

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-[#08243f] dark:border-[#2c806c] dark:bg-[#123b38] dark:font-semibold dark:text-[#55d4aa]">
                  1
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6f2] text-[#17634f] shadow-sm dark:border dark:border-[#2c806c]/60 dark:bg-[#102b3b] dark:text-[#55d4aa] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
                  <FilePlus2 size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#08243f] dark:text-white">
                  Submit your application
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-[#9eabb5]">
                  Choose whether you are applying as a private seller or a
                  real-estate agent.
                </p>
              </div>

            </div>

            <div className="flex gap-4 border-b border-gray-200 py-5 dark:border-white/10">

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-[#08243f] dark:border-[#2c806c] dark:bg-[#123b38] dark:font-semibold dark:text-[#55d4aa]">
                  2
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6f2] text-[#17634f] shadow-sm dark:border dark:border-[#2c806c]/60 dark:bg-[#102b3b] dark:text-[#55d4aa] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
                  <ShieldCheck size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#08243f] dark:text-white">
                  Administrator review
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-[#9eabb5]">
                  An administrator checks the application and approves or rejects it.
                </p>
              </div>

            </div>

            <div className="flex gap-4 pt-5">

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm text-[#08243f] dark:border-[#2c806c] dark:bg-[#123b38] dark:font-semibold dark:text-[#55d4aa]">
                  3
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6f2] text-[#17634f] shadow-sm dark:border dark:border-[#2c806c]/60 dark:bg-[#102b3b] dark:text-[#55d4aa] dark:shadow-[0_0_18px_rgba(85,224,180,0.08)]">
                  <HousePlus size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#08243f] dark:text-white">
                  Create your listings
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-[#9eabb5]">
                  After approval, list properties for sale or rent and manage
                  them from your account.
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#234354] dark:bg-[#0b2233]/75 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]">

            <p className="text-xs text-gray-500 dark:text-[#8fa0ac]">
              Regular account
            </p>

            <h2 className="mt-4 text-xl font-semibold text-[#08243f] dark:text-white">
              Ready to list a property?
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-[#9eabb5]">
              Your account must be approved before you can create or manage
              listings.
            </p>

            <Link
              to="/applicationform"
              className="
                mt-6 block
                rounded-lg
                bg-[#17634f]
                px-4 py-3
                text-center
                text-sm font-medium
                text-white
                hover:bg-[#12503f]
                dark:bg-[#20c997]
                dark:text-[#06241d]
                dark:shadow-[0_0_25px_rgba(32,201,151,0.18)]
                dark:hover:bg-[#2bd8a6]
              "
            >
              Apply as seller or agent
            </Link>

          </div>

        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-white/10">

          <h2 className="text-2xl font-semibold text-[#08243f] dark:text-white">
            After approval, you can
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-[#234354] dark:bg-[#0b2233]/65 dark:shadow-[0_12px_30px_rgba(0,0,0,0.20)] dark:transition-all dark:duration-200 dark:hover:-translate-y-1 dark:hover:border-[#2c806c] dark:hover:bg-[#102b3b]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f6f1] text-[#17634f] shadow-sm dark:border dark:border-[#2c806c]/60 dark:bg-[#123b38] dark:text-[#55d4aa] dark:shadow-[0_0_20px_rgba(85,224,180,0.08)]">
                <House size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-medium text-[#08243f] dark:text-white">
                Create listings for sale or rent
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-[#234354] dark:bg-[#0b2233]/65 dark:shadow-[0_12px_30px_rgba(0,0,0,0.20)] dark:transition-all dark:duration-200 dark:hover:-translate-y-1 dark:hover:border-[#2c806c] dark:hover:bg-[#102b3b]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f6f1] text-[#17634f] shadow-sm dark:border dark:border-[#2c806c]/60 dark:bg-[#123b38] dark:text-[#55d4aa] dark:shadow-[0_0_20px_rgba(85,224,180,0.08)]">
                <FilePenLine size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-medium text-[#08243f] dark:text-white">
                Edit, remove, and manage your listings
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-[#234354] dark:bg-[#0b2233]/65 dark:shadow-[0_12px_30px_rgba(0,0,0,0.20)] dark:transition-all dark:duration-200 dark:hover:-translate-y-1 dark:hover:border-[#2c806c] dark:hover:bg-[#102b3b]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f6f1] text-[#17634f] shadow-sm dark:border dark:border-[#2c806c]/60 dark:bg-[#123b38] dark:text-[#55d4aa] dark:shadow-[0_0_20px_rgba(85,224,180,0.08)]">
                <ChartNoAxesCombined size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-medium text-[#08243f] dark:text-white">
                Use AI market-price and price-prediction tools
              </h3>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Sell;