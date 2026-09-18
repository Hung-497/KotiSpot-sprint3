import logo from "../assets/KotiSpot_logo.png";
import { navLinks } from "../../data";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedin, FaFacebook, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#f1f7f4] px-6 py-10 md:px-12 lg:px-16">

  <div className="mx-auto flex max-w-350 flex-col gap-10 md:flex-row md:items-start md:justify-between">

    <div className="flex-1">
      <img src={logo} alt="KotiSpot" className="h-auto w-57.5"/>

      <div className="mt-5 flex gap-4 text-xl text-[#08243f]">

        <a href="#" className="transition hover:text-[#1f7356]">
          <FaGithub />
        </a>

        <a href="#" className="transition hover:text-[#1f7356]">
          <FaInstagram />
        </a>

        <a href="#" className="transition hover:text-[#1f7356]">
          <FaLinkedin />
        </a>

        <a href="#" className="transition hover:text-[#1f7356]">
          <FaXTwitter />
        </a>

        <a href="#" className="transition hover:text-[#1f7356]">
          <FaFacebook />
        </a>
      </div>
    </div>


    <div className="flex-1">
      <h3 className="mb-4 text-lg font-bold">Explore</h3>

      <ul className="space-y-2 text-black-600">
        {navLinks.map((link) => (
          <li key={link.id}>
            <Link to={link.href} className="transition-colors hover:text-[#1f7356]">
              {link.footerText}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex-1">
      <h3 className="mb-4 text-lg font-bold">Helpful Links</h3>

      <ul className="space-y-2 text-black-600">

        <li>
          <a href="#" className="transition-colors hover:text-[#1f7356]">
            FAQ
          </a>
        </li>

        <li>
          <a href="#" className="transition-colors hover:text-[#1f7356]">
            Privacy Policy
          </a>
        </li>

        <li>
          <a href="#" className="transition-colors hover:text-[#1f7356]">
            Terms of Service
          </a>
        </li>
      </ul>
    </div>


    <div className="flex-1">
      <h3 className="mb-4 text-lg font-bold">
        Create your account
      </h3>

      <p className="mb-4">
        Get your property now!
      </p>

      <form className="flex max-w-350">
        <input type="email" placeholder="Enter your email" className="min-w-0 flex-1 border border-gray-300 bg-white px-4 py-3 outline-none"/>

        <button type="submit" className="bg-[#1f7356] px-5 py-3 font-medium text-white transition hover:bg-[#1a5e45]">
          Sign Up
        </button>
      </form>
    </div>

  </div> 

  <div className="mx-auto mt-12 flex max-w-350 flex-col gap-5 border-t border-gray-300 pt-6 text-sm md:flex-row md:items-center md:justify-between">

    <div className="flex gap-4">
      <span>🇫🇮 Finland</span>
      <span>🌐 English | Suomi</span>
    </div>

    <p>
      © 2026 KotiSpot. All rights reserved.
    </p>

  </div>

</footer>

  );
};

export default Footer