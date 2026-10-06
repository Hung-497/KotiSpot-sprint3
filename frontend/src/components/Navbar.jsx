import { navLinks, authLinks } from "../../data";
import logo from "../assets/KotiSpot_logo.png";
import darkLogo from "../assets/KotiSpot_darklogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PAGE_LOADING_MS } from "../hooks/useMinimumDuration";
import SavingOverlay from "./SavingOverlay";
import useDialog from "../hooks/useDialog";
import {
  User,
  Heart,
  House,
  Settings,
  Bell,
  BriefcaseBusiness,
  LogOut,
  Menu,
  X,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";

// Pages a nav link also counts as current on. Approved sellers and agents
// who open Sell are redirected to the listing form at /listings.
const extraActivePaths = { "/sell": ["/listings"] };

const isLinkActive = (href, pathname) =>
  [href, ...(extraActivePaths[href] || [])].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

// The active link's underline is a separate sliding element (see below);
// hovering another link grows a faint underline under it.
const desktopLinkClass = (isActive) =>
  `relative flex h-full items-center px-3 text-[15px] font-medium transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-center after:rounded-full after:bg-line-strong after:transition-transform after:duration-200 ${
    isActive
      ? "text-pine-700 after:scale-x-0"
      : "text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100"
  }`;

const mobileLinkClass = (isActive) =>
  `flex items-center rounded-control px-3 py-3 text-base font-medium transition-colors ${
    isActive ? "bg-pine-50 text-pine-700" : "text-ink hover:bg-surface-muted"
  }`;

const menuItemClass =
  "flex items-center gap-3 rounded-control px-3 py-2.5 text-sm text-ink transition-colors hover:bg-pine-50 hover:text-pine-700";

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutInProgress = useRef(false);
  const { showConfirm } = useDialog();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const desktopListRef = useRef(null);
  const desktopLinkRefs = useRef({});
  const underlineRef = useRef(null);
  const hasPlacedUnderline = useRef(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    // Include the trigger so clicking it still toggles the menu normally.
    const handleOutsidePointer = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer, true);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const isAdmin = user?.role === "administrator";

  // Administrators moderate listings but don't sell or own any
  const canManageListings =
    ["seller", "agent"].includes(user?.role) && Boolean(user?.verifiedAt);

  // Sellers can still apply to become an agent
  const canApply = !["agent", "administrator"].includes(user?.role);
  const isSeller = user?.role === "seller";

  const visibleNavLinks = navLinks.filter(
    (link) => !(isAdmin && ["/contact", "/sell"].includes(link.href)),
  );

  const navItems = [
    ...visibleNavLinks.map((link) => ({
      key: link.id,
      href: link.href,
      text: link.text,
    })),
    ...(isAdmin
      ? [{ key: "admin", href: "/adminpanel", text: "Admin panel" }]
      : []),
  ];
  const activeHref =
    navItems.find((item) => isLinkActive(item.href, pathname))?.href ?? null;

  // Slides the pine underline to the current page's link
  useLayoutEffect(() => {
    const underline = underlineRef.current;
    const list = desktopListRef.current;

    if (!underline || !list) {
      return undefined;
    }

    const place = () => {
      const link = activeHref ? desktopLinkRefs.current[activeHref] : null;

      if (!link || link.offsetWidth === 0) {
        underline.style.opacity = "0";
        return;
      }

      const inset = 12; // matches the links' px-3
      underline.style.width = `${link.offsetWidth - inset * 2}px`;
      underline.style.transform = `translateX(${link.offsetLeft + inset}px)`;
      underline.style.opacity = "1";
    };

    // First placement happens without sliding in from the left edge
    if (!hasPlacedUnderline.current) {
      underline.style.transition = "none";
      place();
      underline.getBoundingClientRect();
      underline.style.transition = "";
      hasPlacedUnderline.current = true;
    } else {
      place();
    }

    // Re-measure when the font loads or the list appears at md width
    const observer = new ResizeObserver(place);
    observer.observe(list);

    return () => observer.disconnect();
  }, [activeHref, navItems.length]);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User";

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsMobileNavOpen(false);
  };

  // Shows a "Logging out…" screen for PAGE_LOADING_MS, then logs out
  const handleLogout = async () => {
    if (logoutInProgress.current) return;
    logoutInProgress.current = true;
    closeMenus();

    try {
      const confirmed = await showConfirm({
        title: "Log out",
        message:
          "Are you sure you want to log out?\nYou will need to log in again to access your account",
        confirmLabel: "Log out",
        danger: true,
      });

      if (!confirmed) return;

      setIsLoggingOut(true);
      await new Promise((resolve) => setTimeout(resolve, PAGE_LOADING_MS));
      await onLogout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
      logoutInProgress.current = false;
    }
  };

  return (
    <nav
      className="sticky top-0 z-60 border-b border-line bg-surface"
      aria-busy={isLoggingOut}
    >
      {isLoggingOut && <SavingOverlay label="Logging out…" />}
      <div className="ks-container flex h-16 items-center gap-2 sm:gap-4 lg:h-18">
        <Link to="/" className="flex shrink-0 items-center rounded-control">
          <img
            className="h-auto w-28 sm:w-34 lg:w-40 dark:hidden"
            src={logo}
            alt="Kotispot"
          />
          <img
            src={darkLogo}
            alt="Kotispot"
            className="hidden h-auto w-28 sm:w-34 lg:w-40 dark:block"
          />
        </Link>

        <ul
          ref={desktopListRef}
          className="relative mx-auto hidden h-full items-stretch lg:flex"
        >
          {navItems.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <li key={item.key}>
                <Link
                  ref={(element) => {
                    desktopLinkRefs.current[item.href] = element;
                  }}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={desktopLinkClass(isActive)}
                >
                  {item.text}
                </Link>
              </li>
            );
          })}

          <li
            ref={underlineRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-pine-700 opacity-0 transition-[transform,width,opacity] duration-260 ease-standard"
          />
        </ul>

        <ul className="ml-auto flex items-center gap-2 lg:ml-0">
          {isLoggedIn ? (
            <li ref={profileMenuRef} className="relative">
              <button
                ref={profileButtonRef}
                type="button"
                disabled={isLoggingOut}
                aria-label={
                  isMenuOpen ? "Close profile menu" : "Open profile menu"
                }
                aria-expanded={isMenuOpen}
                aria-controls="navbar-profile-menu"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsMenuOpen((current) => !current);
                }}
                className={`flex h-11 items-center gap-1 rounded-full border py-1 pl-1 pr-2 transition-colors sm:h-10 ${
                  isMenuOpen
                    ? "border-pine-200 bg-pine-50"
                    : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pine-700 text-white">
                  <User size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className={`text-ink-muted transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMenuOpen && (
                <div
                  id="navbar-profile-menu"
                  className="fixed inset-x-3 top-18 z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-card border border-line bg-surface p-3 shadow-raised sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-88"
                >
                  <div className="mb-2 flex items-center gap-3 rounded-control bg-pine-50 p-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-pine-700">
                      <CircleUserRound
                        size={26}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold capitalize text-ink">
                        {displayName}
                      </h3>

                      <p className="truncate text-sm text-ink-muted">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className={menuItemClass}
                    >
                      <User size={18} strokeWidth={1.8} aria-hidden="true" />
                      Profile information
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setIsMenuOpen(false)}
                      className={menuItemClass}
                    >
                      <Heart size={18} strokeWidth={1.8} aria-hidden="true" />
                      Favorites
                    </Link>
                    {canManageListings && (
                      <Link
                        to="/mylistings"
                        onClick={() => setIsMenuOpen(false)}
                        className={menuItemClass}
                      >
                        <House size={18} strokeWidth={1.8} aria-hidden="true" />
                        My listings
                      </Link>
                    )}

                    <Link
                      to="/notifications"
                      onClick={() => setIsMenuOpen(false)}
                      className={menuItemClass}
                    >
                      <Bell size={18} strokeWidth={1.8} aria-hidden="true" />
                      Notifications
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className={menuItemClass}
                    >
                      <Settings
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      Settings
                    </Link>
                    {canApply && (
                      <Link
                        to="/applicationform"
                        onClick={() => setIsMenuOpen(false)}
                        className={`${menuItemClass} items-start`}
                      >
                        <BriefcaseBusiness
                          size={18}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0"
                        />

                        {isSeller ? (
                          <span>Upgrade to Real-estate Agent</span>
                        ) : (
                          <span>
                            Apply for a Seller/Real-estate Agent position
                          </span>
                        )}
                      </Link>
                    )}
                  </div>

                  <div className="my-2 border-t border-line" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-danger-soft hover:text-danger"
                  >
                    <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </li>
          ) : (
            authLinks.map((link, index) => (
              <li
                key={link.id}
                className={
                  index === authLinks.length - 1 ? "" : "hidden sm:block"
                }
              >
                <Link
                  to={link.href}
                  className={
                    index === authLinks.length - 1
                      ? "ks-btn ks-btn-primary"
                      : "ks-btn ks-btn-ghost"
                  }
                >
                  {link.text}
                </Link>
              </li>
            ))
          )}

          <li className="lg:hidden">
            <button
              type="button"
              aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-nav"
              onClick={() => {
                setIsMenuOpen(false);
                setIsMobileNavOpen(!isMobileNavOpen);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-control text-ink transition-colors hover:bg-surface-muted"
            >
              {isMobileNavOpen ? (
                <X size={22} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Menu size={22} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </li>
        </ul>
      </div>

      {isMobileNavOpen && (
        <div
          id="mobile-nav"
          className="border-t border-line bg-surface px-4 pb-4 pt-2 sm:px-6 lg:hidden"
        >
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.href === activeHref;

              return (
                <li key={item.key}>
                  <Link
                    to={item.href}
                    onClick={closeMenus}
                    aria-current={isActive ? "page" : undefined}
                    className={mobileLinkClass(isActive)}
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* The last auth link (Register) stays in the bar on every width */}
          {!isLoggedIn && (
            <div className="mt-3 grid gap-2 border-t border-line pt-3 sm:hidden">
              {authLinks.slice(0, -1).map((link) => (
                <Link
                  key={link.id}
                  to={link.href}
                  onClick={closeMenus}
                  className="ks-btn ks-btn-secondary w-full"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
