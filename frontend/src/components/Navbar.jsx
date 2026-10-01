import { navLinks, authLinks } from "../../data";
import logo from "../assets/KotiSpot_logo.png";
import darkLogo from "../assets/KotiSpot_darklogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Heart, House, Settings, Bell, BriefcaseBusiness, LogOut,} from "lucide-react";

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "administrator";

  // Administrators moderate listings but don't sell or own any
  const canManageListings =
    ["seller", "agent"].includes(user?.role) && Boolean(user?.verifiedAt);

  // Sellers can still apply to become an agent
  const canApply = !["agent", "administrator"].includes(user?.role);
  const isSeller = user?.role === "seller";

  const handleLogout = () => {
    setIsMenuOpen(false);
    setShowLogoutConfirm(false);
    onLogout();
    navigate("/");
  };

  return (
    <nav className="absolute left-0 top-0 z-50 isolate flex h-17 w-full items-center px-8 lg:px-[13%] bg-transparent
                    before:pointer-events-none
                    before:absolute
                    before:inset-0
                    before:-z-10

                    before:bg-white/90
                    before:backdrop-blur-[3px]

                    before:mask-[linear-gradient(to_right,transparent_0%,transparent_3%,black_16%,black_84%,transparent_97%,transparent_100%)]

                    dark:before:bg-[#081520]/90">

      <Link to="/" className="flex items-center">
        <img className="h-auto w-45 dark:hidden" src={logo} alt="Kotispot"/>
        <img className="hidden h-auto w-45 dark:block" src={darkLogo} alt="Kotispot"/>
      </Link>

      <ul className="mx-auto flex items-center gap-10">
        {navLinks
          .filter(
            (link) => !(isAdmin && ["/contact", "/sell"].includes(link.href)),
          )
          .map((link) => (
            <li key={link.id}>
              <Link
                to={link.href}
                className="text-[15px] font-medium text-[#08243f] transition-colors hover:text-[#1f7356] dark:text-gray-100 dark:hover:text-green-400"
              >
                {link.text}
              </Link>
            </li>
          ))}
        {isAdmin && (
          <li>
            <Link
              to="/adminpanel"
              className="text-[15px] font-medium text-[#08243f] transition-colors hover:text-[#1f7356] dark:text-gray-100 dark:hover:text-green-400"
            >
              Admin panel
            </Link>
          </li>
        )}
      </ul>

      <ul className="flex items-center gap-3">
        {isLoggedIn ? (
          <li className="relative">
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#08243f] shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
              <User size={23} strokeWidth={2}/>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-14 z-50 w-105 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_15px_40px_rgba(15,35,55,0.15)] dark:border-gray-700 dark:bg-gray-900">
                <div className="absolute -top-2 right-7 h-4 w-4 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" />

                <div className="relative z-10 mb-5 flex items-center gap-4 rounded-2xl bg-[#f1f7f4] px-5 py-5 dark:bg-gray-800">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e2f0e9] text-[#17634f] dark:bg-gray-700 dark:text-green-400">
                    <User size={34} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold capitalize text-[#08243f] dark:text-white">
                      {[user?.firstName, user?.lastName]
                        .filter(Boolean)
                        .join(" ") || "User"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="mb-3 border-t border-gray-200 dark:border-gray-700" />

                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f] dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-green-400"
                  >
                    <User size={20} strokeWidth={1.8} />
                    Profile information
                  </Link>

                  <Link
                    to="/favorites"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f] dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-green-400"
                  >
                    <Heart size={20} strokeWidth={1.8} />
                    Favorites
                  </Link>
                  {canManageListings && (
                    <Link
                      to="/mylistings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f] dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-green-400"
                    >
                      <House size={20} strokeWidth={1.8} />
                      My listings
                    </Link>
                  )}

                  <Link
                    to="/notifications"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f] dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-green-400"
                  >
                    <Bell size={20} strokeWidth={1.8} />
                    Notifications
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f] dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-green-400"
                  >
                    <Settings size={20} strokeWidth={1.8} />
                    Settings
                  </Link>
                  {canApply && (
                    <Link
                      to="/applicationform"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f] dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-green-400"
                    >
                      <BriefcaseBusiness
                        size={20}
                        strokeWidth={1.8}
                        className="mt-0.5 shrink-0"
                      />

                      {isSeller ? (
                        <span>Upgrade to Real-estate Agent</span>
                      ) : (
                        <span>
                          Apply for a Seller/Real-estate
                          <br />
                          Agent position
                        </span>
                      )}
                    </Link>
                  )}
                </div>

                <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#08243f] transition hover:bg-red-50 hover:text-red-600 dark:text-gray-200 dark:hover:bg-red-950 dark:hover:text-red-400"
                >
                  <LogOut size={20} strokeWidth={1.8} />
                  Log out
                </button>
              </div>
            )}

            {isLoggedIn && showLogoutConfirm && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30">
                <div className="w-87.5 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                  <h2 className="text-lg font-semibold text-[#08243f] dark:text-white">
                    Log out
                  </h2>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to log out?
                    <br />
                    You will need to log in again to access your account
                  </p>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-[#08243f] dark:border-gray-600 dark:text-gray-200"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ) : (
          authLinks.map((link, index) => (
            <li key={link.id}>
              <Link
                to={link.href}
                className={
                  index === authLinks.length - 1
                    ? "rounded-lg bg-[#1f7356] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#165942]"
                    : "rounded-lg border border-[#1f7356] px-5 py-2.5 text-sm font-medium text-[#1f7356] transition hover:bg-[#eef6f2] dark:border-green-400 dark:text-green-400 dark:hover:bg-gray-800"
                }
              >
                {link.text}
              </Link>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
