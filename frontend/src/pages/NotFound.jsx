import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#f8faf9] px-6 py-12">
            <div className="mx-auto max-w-xl">
                <div className="rounded-2xl border border-gray-300 bg-white px-10 py-8 text-center shadow-sm">
                    <p className="text-3xl font-bold text-[#17634f]">404</p>

                    <h1 className="mt-2 text-lg font-semibold text-[#08243f]">
                        Page not found
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        The page you are looking for doesn't exist or has been moved.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#12503f]"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
