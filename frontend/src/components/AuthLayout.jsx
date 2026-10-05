// Shared layout for the log in and sign up pages: a solid pine brand
// panel with a hand-drawn house mark, and the form on a plain surface.
// On phones the panel becomes a short band above the form.
import Contours from "./Contours";

const HouseMark = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="ks-house-mark h-14 w-14 text-white sm:h-16 sm:w-16 lg:h-28 lg:w-28"
  >
    <path pathLength="1" d="M12 58 L60 18 L108 58" />
    <path pathLength="1" d="M24 50 V104 H96 V50" />
    <path pathLength="1" d="M50 104 V76 H70 V104" />
  </svg>
);

const AuthLayout = ({
  panelHeading,
  panelText,
  title,
  subtitle,
  stepKey,
  footer,
  children,
}) => (
  <div className="ks-container flex grow items-center py-6 md:py-12">
    <div className="grid w-full overflow-hidden rounded-card border border-line bg-surface shadow-card lg:min-h-136 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <aside className="relative flex flex-col gap-6 overflow-hidden bg-pine-800 px-4 py-6 text-white sm:px-10 sm:py-8 lg:justify-between lg:px-12 lg:py-12">
      <Contours variant="left" className="text-white opacity-15" />

      <div className="relative">
        <HouseMark />
      </div>

      <div className="relative">
        <p className="max-w-md text-2xl font-semibold leading-tight tracking-tight lg:text-4xl">
          {panelHeading}
        </p>
        <p className="mt-3 max-w-sm text-white/75 lg:text-lg">{panelText}</p>
      </div>
    </aside>

    <section className="flex items-center justify-center px-4 py-6 sm:px-10 sm:py-10 lg:py-12">
      <div className="w-full max-w-sm">
        <h1 className="ks-page-title">{title}</h1>
        <p className="mt-2 text-ink-muted">{subtitle}</p>

        {/* Re-keyed per step so each step slides in */}
        <div key={stepKey} className="ks-step-enter mt-8">
          {children}
        </div>

        {footer && (
          <div className="mt-8 border-t border-line pt-6 text-sm text-ink-muted">
            {footer}
          </div>
        )}
      </div>
    </section>
    </div>
  </div>
);

export default AuthLayout;
