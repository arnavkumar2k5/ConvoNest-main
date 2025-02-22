import React, { useEffect, useState } from "react";

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      if (e.touches) {
        setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      } else {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("touchstart", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("touchstart", updatePosition);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-10 h-10 pointer-events-none mix-blend-lighten transition-transform duration-75 ease-out"
      style={{
        transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
      }}
    >
      <div className="w-10 h-10 bg-blue-400 opacity-40 blur-xl rounded-full absolute"></div>
      <div className="w-6 h-6 bg-white opacity-60 blur-lg rounded-full absolute"></div>
    </div>
  );
}

export default CustomCursor;
