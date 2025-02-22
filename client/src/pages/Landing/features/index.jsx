import React from "react";
import { FaRocketchat, FaLock, FaLaptop, FaSmile } from "react-icons/fa";

function Features() {
  return (
    <div className="w-full py-16 bg-white text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-[#004AAD]">
        Why Choose Convonest?
      </h2>
      <p className="text-lg text-gray-600 mt-4">
        The ultimate chat experience with powerful features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 px-6 md:px-16">
        <div className="flex flex-col items-center p-6 bg-[#F0F9FF] rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaRocketchat className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">Real-time Chat</h3>
          <p className="text-gray-600 mt-2">
            Enjoy smooth, instant messaging without delays.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-[#F0F9FF] rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaLock className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">End-to-End Encryption</h3>
          <p className="text-gray-600 mt-2">
            Your messages stay private and secure at all times.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-[#F0F9FF] rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaLaptop className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">Multi-Platform</h3>
          <p className="text-gray-600 mt-2">
            Use Convonest on mobile, desktop, and web.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-[#F0F9FF] rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer">
          <FaSmile className="text-[#007BFF] text-5xl mb-4" />
          <h3 className="text-xl font-bold text-[#004AAD]">Custom Emojis</h3>
          <p className="text-gray-600 mt-2">
          Express yourself with a wide range of custom emojis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
