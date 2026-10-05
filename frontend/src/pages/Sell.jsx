import { Link } from "react-router-dom";
import { FilePlus2, ShieldCheck, HousePlus, House, FilePenLine, ChartNoAxesCombined } from "lucide-react";

const Sell = () => {
  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="ks-page-title">
          Sell or rent out <span className="text-pine-700">your property</span>
        </h1>

        <p className="mt-2 text-sm text-ink-muted">
          Create and manage property listings after becoming an approved seller
          or real-estate agent.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-card border border-line bg-surface p-4 sm:p-6">

            <h2 className="text-xl font-semibold text-ink">
              How it works
            </h2>

            <div className="mt-6 flex gap-4 border-b border-line pb-5">

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm text-ink dark:bg-[#123b38] dark:font-semibold">
                  1
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-card bg-pine-50 text-pine-700 shadow-card dark:border dark:border-[#2c806c]/60">
                  <FilePlus2 size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-ink">
                  Submit your application
                </h3>

                <p className="mt-1 text-sm text-ink-muted">
                  Choose whether you are applying as a private seller or a
                  real-estate agent.
                </p>
              </div>

            </div>

            <div className="flex gap-4 border-b border-line py-5">

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm text-ink dark:bg-[#123b38] dark:font-semibold">
                  2
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-card bg-pine-50 text-pine-700 shadow-card dark:border dark:border-[#2c806c]/60">
                  <ShieldCheck size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-ink">
                  Administrator review
                </h3>

                <p className="mt-1 text-sm text-ink-muted">
                  An administrator checks the application and approves or rejects it.
                </p>
              </div>

            </div>

            <div className="flex gap-4 pt-5">

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm text-ink dark:bg-[#123b38] dark:font-semibold">
                  3
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-card bg-pine-50 text-pine-700 shadow-card dark:border dark:border-[#2c806c]/60">
                  <HousePlus size={21} strokeWidth={1.8} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-ink">
                  Create your listings
                </h3>

                <p className="mt-1 text-sm text-ink-muted">
                  After approval, list properties for sale or rent and manage
                  them from your account.
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-card border border-line bg-surface p-4 sm:p-6">

            <p className="text-xs text-ink-muted">
              Regular account
            </p>

            <h2 className="mt-4 text-xl font-semibold text-ink">
              Ready to list a property?
            </h2>

            <p className="mt-2 text-sm text-ink-muted">
              Your account must be approved before you can create or manage
              listings.
            </p>

            <Link
              to="/applicationform"
              className="mt-6 block rounded-control bg-pine-700 px-4 py-3 text-center text-sm font-medium text-white hover:bg-pine-800"
            >
              Apply as seller or agent
            </Link>

          </div>

        </div>

        <div className="mt-8 border-t border-line pt-8">

          <h2 className="text-2xl font-semibold text-ink">
            After approval, you can
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-card border border-line bg-surface p-5 dark:transition-all dark:duration-200">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-card bg-[#e8f6f1] text-pine-700 shadow-card dark:border dark:border-[#2c806c]/60">
                <House size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-medium text-ink">
                Create listings for sale or rent
              </h3>
            </div>

            <div className="rounded-card border border-line bg-surface p-5 dark:transition-all dark:duration-200">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-card bg-[#e8f6f1] text-pine-700 shadow-card dark:border dark:border-[#2c806c]/60">
                <FilePenLine size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-medium text-ink">
                Edit, remove, and manage your listings
              </h3>
            </div>

            <div className="rounded-card border border-line bg-surface p-5 dark:transition-all dark:duration-200">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-card bg-[#e8f6f1] text-pine-700 shadow-card dark:border dark:border-[#2c806c]/60">
                <ChartNoAxesCombined size={22} strokeWidth={1.8} />
              </div>

              <h3 className="font-medium text-ink">
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