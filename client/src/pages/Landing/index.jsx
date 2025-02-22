import React from "react";
import Features from "./features";
import HowItWorks from "./HowIt";
import Testimonials from "./Testimonals";
import FAQ from "./Faq";
import Footer from "./Footer";
import CustomCursor from "./Cursor";
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();
  return (
    <div>

    <div className="min-h-screen w-full bg-gradient-to-br from-[#40C4FF] via-[#007BFF] to-[#004AAD] flex flex-col gap-5 md:gap-0 items-center justify-center text-center px-6">
      <h1 className="text-5xl md:text-8xl font-extrabold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
        CONVONEST
      </h1>

      <h2 className="text-2xl md:text-4xl text-white font-semibold mt-6">
        "Seamless Conversations, Anytime, Anywhere!"
      </h2>

      <p className="text-lg md:text-2xl text-white mt-4 max-w-3xl opacity-90">
        Connect with friends, family, and colleagues in real-time with a secure
        and fast chat experience.
      </p>

      <div className="mt-8">
        <button className="px-8 py-3 bg-white text-[#004AAD] font-bold text-lg md:text-xl rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300" onClick={() => navigate("/auth")}>
          Get Started
        </button>
      </div>
    </div>
    <CustomCursor/>
    <Features/>
    <HowItWorks/>
    <Testimonials/>
    <FAQ/>
    <Footer/>
    </div>
  );
}

export default Landing;
