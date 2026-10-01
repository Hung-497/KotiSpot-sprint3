import logo from "../assets/KotiSpot_logo.png";
import { navLinks } from "../../data";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedin, FaFacebook, FaXTwitter } from "react-icons/fa6";
import darkLogo from "../assets/KotiSpot_darklogo.png";

const Footer = ({ isAdmin }) => {
  return (
    <footer className="bg-[#f1f7f4] px-6 py-10 transition-colors duration-300 md:px-12 lg:px-16 dark:bg-[#071b2b]">

  <div className="mx-auto flex max-w-350 flex-col gap-10 md:flex-row md:items-start md:justify-between">

    <div className="flex-1">
      <img src={logo} alt="KotiSpot" className="h-auto w-57.5 dark:hidden"/>
      <img className="hidden h-auto w-45 dark:block" src={darkLogo} alt="Kotispot"/>

      <div className="mt-5 flex gap-4 text-xl text-[#08243f] dark:text-gray-200">

        <a href="#" className="transition hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
          <FaGithub />
        </a>

        <a href="#" className="transition hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
          <FaInstagram />
        </a>

        <a href="#" className="transition hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
          <FaLinkedin />
        </a>

        <a href="#" className="transition hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
          <FaXTwitter />
        </a>

        <a href="#" className="transition hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
          <FaFacebook />
        </a>
      </div>
    </div>


    <div className="flex-1">
      <h3 className="mb-4 text-lg font-bold text-[#08243f] dark:text-white">Explore</h3>

      <ul className="space-y-2 text-[#08243f] dark:text-gray-300">
        {navLinks
          .filter((link) => !(isAdmin && link.href === "/sell"))
          .map((link) => (
          <li key={link.id}>
            <Link to={link.href} className="transition-colors hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
              {link.footerText}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex-1">
      <h3 className="mb-4 text-lg font-bold text-[#08243f] dark:text-white">Helpful Links</h3>

      <ul className="space-y-2 text-[#08243f] dark:text-gray-300">

        <li>
          <a href="#" className="transition-colors hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
            FAQ
          </a>
        </li>

        <li>
          <a href="#" className="transition-colors hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
            Privacy Policy
          </a>
        </li>

        <li>
          <a href="#" className="transition-colors hover:text-[#1f7356] dark:hover:text-[#63ddb6]">
            Terms of Service
          </a>
        </li>
      </ul>
    </div>


    <div className="flex-1">
      <h3 className="mb-4 text-lg font-bold text-[#08243f] dark:text-white">
        Create your account
      </h3>

      <p className="mb-4 text-[#08243f] dark:text-gray-300">
        Get your property now!
      </p>

      <form className="flex max-w-350">
        <input type="email" placeholder="Enter your email" className="min-w-0 flex-1 border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#1f7356]
                dark:border-[#31536a]
                dark:bg-[#0b2436]
                dark:text-white
                dark:placeholder:text-gray-400
                dark:focus:border-[#55d4aa]"
        />

        <button type="submit" className="bg-[#1f7356] px-5 py-3 font-medium text-white transition hover:bg-[#1a5e45] dark:bg-[#11966f] dark:hover:bg-[#15aa7e]">
          Sign Up
        </button>
      </form>
    </div>

  </div> 

  <div className="mx-auto mt-12 flex max-w-350 flex-col gap-5 border-t border-gray-300 pt-6 text-sm md:flex-row md:items-center md:justify-between dark:border-[#294457] dark:text-gray-300">

    <div className="flex gap-4">
      <span>🇫🇮 Finland</span>
      <span className="dark:text-[#55d4aa]">🌐 English | Suomi</span>
    </div>

    <p>
      © 2026 KotiSpot. All rights reserved.
    </p>

  </div>

</footer>

  );
};

export default Footer