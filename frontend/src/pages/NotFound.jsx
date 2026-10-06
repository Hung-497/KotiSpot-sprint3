import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-canvas px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-xl">
                <div className="rounded-card border border-line bg-surface px-4 py-6 sm:px-10 sm:py-8 text-center shadow-card">
                    <p className="text-3xl font-bold text-pine-700">404</p>

                    <h1 className="ks-page-title mt-2 text-lg">
                        Page not found
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-ink-muted">
                        The page you are looking for doesn't exist or has been moved.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-control bg-pine-700 px-4 py-2 text-sm font-medium text-white hover:bg-pine-800"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
