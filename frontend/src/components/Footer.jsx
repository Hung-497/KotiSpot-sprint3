import logo from "../assets/KotiSpot_logo.png";
import darkLogo from "../assets/KotiSpot_darklogo.png";
import { navLinks } from "../../data";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedin, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Globe, MapPin } from "lucide-react";
import Contours from "./Contours";

const socialLinks = [
  { label: "GitHub", Icon: FaGithub },
  { label: "Instagram", Icon: FaInstagram },
  { label: "LinkedIn", Icon: FaLinkedin },
  { label: "X", Icon: FaXTwitter },
  { label: "Facebook", Icon: FaFacebook },
];

const footerLinkClass =
  "rounded-sm text-sm text-ink-muted transition-colors hover:text-pine-700";

const Footer = ({ isAdmin }) => {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface-muted text-ink">
      <Contours variant="right" className="text-pine-700 opacity-[0.06] dark:opacity-10" />

      <div className="ks-container relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div>
          <Link to="/" className="inline-flex items-center rounded-control">
            <img src={logo} alt="KotiSpot" className="h-auto w-36 dark:hidden" />
            <img src={darkLogo} alt="KotiSpot" className="hidden h-auto w-36 dark:block" />
          </Link>

          <div className="mt-5 flex gap-1 text-lg text-ink-muted">
            {socialLinks.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-control transition-colors hover:bg-pine-50 hover:text-pine-700 sm:h-9 sm:w-9"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-ink">Explore</h3>

          <ul className="space-y-2.5">
            {navLinks
              .filter((link) => !(isAdmin && link.href === "/sell"))
              .map((link) => (
                <li key={link.id}>
                  <Link to={link.href} className={footerLinkClass}>
                    {link.footerText}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-ink">Helpful Links</h3>

          <ul className="space-y-2.5">
            <li>
              <a href="#" className={footerLinkClass}>
                FAQ
              </a>
            </li>

            <li>
              <a href="#" className={footerLinkClass}>
                Privacy Policy
              </a>
            </li>

            <li>
              <a href="#" className={footerLinkClass}>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-ink">
            Create your account
          </h3>

          <p className="mb-4 text-sm text-ink-muted">Get your property now!</p>

          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="ks-input min-h-11 min-w-0 flex-1 text-base sm:text-sm"
            />

            <button type="submit" className="ks-btn ks-btn-primary min-h-11 shrink-0">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="ks-container flex flex-col gap-3 py-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
              Finland
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe size={15} strokeWidth={1.8} aria-hidden="true" />
              English | Suomi
            </span>
          </div>

          <p>© 2026 KotiSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
