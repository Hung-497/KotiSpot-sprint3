import { Link } from "react-router-dom";

const Sell = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-[#08243f]">
          Sell or rent out your property
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create and manage property listings after becoming an approved seller
          or real-estate agent.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">

            <h2 className="text-xl font-semibold text-[#08243f]">
              How it works
            </h2>

            <div className="mt-6 flex gap-4 border-b border-gray-200 pb-5">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                1
              </div>

              <div>
                <h3 className="font-semibold text-[#08243f]">
                  Submit your application
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Choose whether you are applying as a private seller or a
                  real-estate agent.
                </p>
              </div>

            </div>

            <div className="flex gap-4 border-b border-gray-200 py-5">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                2
              </div>

              <div>
                <h3 className="font-semibold text-[#08243f]">
                  Administrator review
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  An administrator checks the application and approves or rejects it.
                </p>
              </div>

            </div>

            <div className="flex gap-4 pt-5">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-sm">
                3
              </div>

              <div>
                <h3 className="font-semibold text-[#08243f]">
                  Create your listings
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  After approval, list properties for sale or rent and manage
                  them from your account.
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">

            <p className="text-xs text-gray-500">
              Regular account
            </p>

            <h2 className="mt-4 text-xl font-semibold text-[#08243f]">
              Ready to list a property?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
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
              "
            >
              Apply as seller or agent
            </Link>

          </div>

        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">

          <h2 className="text-2xl font-semibold text-[#08243f]">
            After approval, you can
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-medium text-[#08243f]">
                Create listings for sale or rent
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-medium text-[#08243f]">
                Edit, remove, and manage your listings
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-medium text-[#08243f]">
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