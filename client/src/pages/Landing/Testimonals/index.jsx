import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const testimonials = [
  {
    name: "Daniel Brown",
    review: "Convonest made chatting so seamless! The UI is amazing, and I love the custom emojis.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jessica Dyer",
    review: "Secure and fast! I feel safe knowing my chats are end-to-end encrypted.",
    rating: 4.5,
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Rohan Mehta",
    review: "The best chat platform I've used! No lag, great experience, and easy to use.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];

function Testimonials() {
  return (
    <div className="w-full py-16 bg-white text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-[#004AAD]">
        What Our Users Say
      </h2>
      <p className="text-lg text-gray-600 mt-4">
        Real feedback from happy users of Convonest.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-6 md:px-16 cursor-pointer">
        {testimonials.map((user, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-[#F0F9FF] rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full mb-4 border-4 border-[#007BFF]"
            />
            <h3 className="text-xl font-bold text-[#004AAD]">{user.name}</h3>
            <p className="text-gray-600 mt-2">{user.review}</p>
            <div className="flex mt-2 text-[#FFD700]">
              {Array.from({ length: Math.floor(user.rating) }, (_, i) => (
                <FaStar key={i} />
              ))}
              {user.rating % 1 !== 0 && <FaStarHalfAlt />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
