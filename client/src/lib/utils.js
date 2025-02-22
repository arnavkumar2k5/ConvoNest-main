import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const colors = [ 
  "bg-[#1565C01A] text-[#1565C0] border-[2px] border-[#1565C0]",
]; 

  export const getColor = (color) => { 
  if (color >= 0 && color < colors.length) { 
  return colors [color]; 
  } 
  return colors[0]; // Fallback to the first color if out of range 
  }; 

  export const animationDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  }