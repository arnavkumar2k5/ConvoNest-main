import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#004AAD] text-white py-8">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold">CONVONEST</h2>
          <p className="mt-2 text-gray-300">
            Seamless conversations, anytime, anywhere.
          </p>
        </div>

        <div className="mt-4 md:mt-0 text-center md:text-start">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-1">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Features</a></li>
            <li><a href="#" className="hover:underline">How It Works</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div className="mt-4 md:mt-0">
          <h3 className="text-lg font-semibold text-center">Follow Us</h3>
          <div className="flex space-x-4 justify-center mt-2">
            <a href="#" className="text-white text-2xl hover:text-[#40C4FF] transition"><FaFacebook /></a>
            <a href="#" className="text-white text-2xl hover:text-[#40C4FF] transition"><FaTwitter /></a>
            <a href="#" className="text-white text-2xl hover:text-[#40C4FF] transition"><FaInstagram /></a>
            <a href="#" className="text-white text-2xl hover:text-[#40C4FF] transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 mt-6 text-sm">
        © {new Date().getFullYear()} Convonest. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
