import React from "react";
import { FaUserPlus, FaCommentDots, FaShieldAlt } from "react-icons/fa";

function HowItWorks() {
  return (
    <div className="w-full py-16 bg-[#F8FBFF] text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-[#004AAD]">
        How It Works
      </h2>
      <p className="text-lg text-gray-600 mt-4">
        Get started with Convonest in just a few steps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-6 md:px-16">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaUserPlus className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">1. Sign Up</h3>
          <p className="text-gray-600 mt-2">
            Create your account in seconds and set up your profile.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaCommentDots className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">2. Start Chatting</h3>
          <p className="text-gray-600 mt-2">
            Connect with friends or join a group and start chatting instantly.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaShieldAlt className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">3. Stay Secure</h3>
          <p className="text-gray-600 mt-2">
            Enjoy encrypted and private conversations with ease.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
