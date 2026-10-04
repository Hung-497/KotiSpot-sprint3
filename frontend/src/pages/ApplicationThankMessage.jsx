const ApplicationThankMessage = () => {
  return (
    <div className="min-h-screen bg-canvas px-6 py-12">

      <div className="mx-auto max-w-xl">

        <div
          className="rounded-card border border-line bg-surface px-10 py-8 text-center shadow-card"
        >
          <div
            className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pine-50 text-xl text-pine-700"
          >
            ✓
          </div>

          <h1 className="ks-page-title text-lg">
            Application submitted!
          </h1>

          <p className="mt-4 text-sm leading-6 text-ink-muted">
            Thank you for applying. We'll review your
            information and notify you when your
            application has been approved.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ApplicationThankMessage;