import { navLinks, authLinks } from "../../data";
import logo from "../assets/KotiSpot_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Heart, House, Settings, Bell, BriefcaseBusiness, ShieldCheck, LogOut } from "lucide-react";


const Navbar = ({ isLoggedIn, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    

    const handleLogout = () => {
        setIsMenuOpen(false);
        setShowLogoutConfirm(false);
        onLogout();
        navigate("/");
    };

    return (
        <nav className="flex h-20 items-center border-b border-gray-200 bg-white px-8 lg:px-16">
            <a href="/" className="flex items-center">
                <img className="w-45 h-auto" src={logo} alt="Kotispot" />
            </a>

            <ul className="mx-auto flex items-center gap-9">
                {navLinks.map((link) => (
                    <li key={link.id}>
                        <Link to={link.href} className="text-[15px] font-medium text-[#08243f] transition-colors hover:text-[#1f7356]">{link.text}</Link>
                    </li>
                ))}
            </ul>

            <ul className="flex items-center gap-3">
                {isLoggedIn ? (
                    <li className="relative">
                        <button
                            type="button"
                            aria-label="Open profile menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f7356] text-white transition-colors hover:bg-[#165942]"
                        >
                            &#128100;
                        </button>
                        {isMenuOpen && (
                        <div className="absolute right-0 top-14 z-50 w-105 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_15px_40px_rgba(15,35,55,0.15)]">
                            <div
                            className="absolute -top-2 right-7 h-4 w-4 rotate-45 border-l border-t border-gray-200 bg-white"/>

                            <div className="relative z-10 mb-5 flex items-center gap-4 rounded-2xl bg-[#f1f7f4] px-5 py-5">

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e2f0e9] text-[#17634f]">
                                <User size={34} strokeWidth={1.8} />
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-[#08243f]">
                                Full name
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                email@example.com
                                </p>
                            </div>
                            </div>

                            
                            <div className="mb-3 border-t border-gray-200" />

                            
                            <div className="space-y-1">

                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <User size={20} strokeWidth={1.8} />
                                Profile information
                            </Link>

                            <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <Heart size={20} strokeWidth={1.8} />
                                Favorites
                            </Link>

                            <Link to="/mylistings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <House size={20} strokeWidth={1.8} />
                                My listings
                            </Link>

                            <Link to="/notifications" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <Bell size={20} strokeWidth={1.8} />
                                Notifications
                            </Link>

                            <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <Settings size={20} strokeWidth={1.8} />
                                Settings
                            </Link>

                            <Link to="/adminpanel" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <ShieldCheck size={20} strokeWidth={1.8} />
                                Admin panel
                            </Link>

                            <Link to="/applicationform" onClick={() => setIsMenuOpen(false)} className="flex items-start gap-4 rounded-xl px-4 py-3 text-sm text-[#08243f] transition hover:bg-[#eef6f2] hover:text-[#17634f]">
                                <BriefcaseBusiness size={20} strokeWidth={1.8} className="mt-0.5 shrink-0"/>

                                <span>
                                Apply for a Seller/Real-estate
                                <br />
                                Agent position
                                </span>
                            </Link>

                            </div>

                            <div className="my-3 border-t border-gray-200" />

                            <button type="button" onClick={() => {
                                setIsMenuOpen(false);
                                setShowLogoutConfirm(true);
                            }}
                            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#08243f] transition hover:bg-red-50 hover:text-red-600">
                            <LogOut size={20} strokeWidth={1.8} />
                            Log out
                            </button>
                        </div>
                        )}

                        {isLoggedIn && showLogoutConfirm && (
                            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/30">

                                <div className="w-87.5 rounded-2xl bg-white p-6 shadow-xl">

                                    <h2 className="text-lg font-semibold text-[#08243f]">
                                        Log out
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Are you sủe you want to log out?
                                        <br />
                                        You will need to log in again to access your account
                                    </p>

                                    <div className="mt-6 flex justify-end gap-3">

                                        <button
                                            type="button"
                                            onClick={() => setShowLogoutConfirm(false)}
                                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-[#08243f]"
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
                            <Link to={link.href}
                                className={index === authLinks.length - 1
                                    ? "rounded-lg bg-[#1f7356] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#165942]"
                                    : "rounded-lg border border-[#1f7356] px-5 py-2.5 text-sm font-medium text-[#1f7356] transition hover:bg-[#eef6f2]"}
                            >{link.text}
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </nav>
    );
};

export default Navbar;