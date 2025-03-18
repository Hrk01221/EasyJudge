import React from "react";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-nav-col text-2xl font-bold">
              Easy<span className="text-white">Judge</span>
            </span>
          </div>
          <p className="text-gray-400">
            Empowering coders with seamless judging and evaluation.
          </p>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-nav-col mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline text-gray-400">
                Home
              </a>
            </li>
            <li>
              <a href="/problems" className="hover:underline text-gray-400">
                Problems
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline text-gray-400">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline text-gray-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-nav-col mb-3">
            Contact Us
          </h3>
          <p className="text-gray-400">Email: support@easyjudge.com</p>
          <div className="flex gap-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-nav-col">
              <Facebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-nav-col">
              <Twitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-nav-col">
              <Linkedin />
            </a>
            <a
              href="mailto:support@easyjudge.com"
              className="text-gray-400 hover:text-nav-col"
            >
              <Mail />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} EasyJudge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
