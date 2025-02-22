import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "Is Convonest free to use?",
    answer: "Yes! Convonest is completely free for all users. Just sign up and start chatting instantly.",
  },
  {
    question: "Are my chats secure?",
    answer: "Absolutely! Convonest uses end-to-end encryption to ensure your conversations stay private and secure.",
  },
  {
    question: "Can I use Convonest on multiple devices?",
    answer: "Yes! Convonest is accessible from any device, including mobile, tablet, and desktop.",
  },
  {
    question: "Do I need to install an app?",
    answer: "No installation is required! Convonest works seamlessly on your browser.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full py-16 bg-[#F8FBFF] text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-[#004AAD]">Frequently Asked Questions</h2>
      <p className="text-lg text-gray-600 mt-4">Find answers to common questions about Convonest.</p>

      <div className="max-w-2xl mx-auto mt-12 px-6 cursor-pointer">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 bg-white p-4 rounded-xl shadow-md">
            <button
              className="w-full flex justify-between items-center text-left text-xl font-semibold text-[#004AAD]"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <FaChevronDown className={`transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
            </button>
            <p
              className={`mt-2 text-gray-600 text-lg transition-all overflow-hidden text-start ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
