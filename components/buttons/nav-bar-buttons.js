import React from "react";

export default function NavBarButtons({ children, type, size, href, onClick }) {
  // Define size classes
  const sizeClasses =
    size === "large"
      ? "px-10 py-4 text-lg font-bold"
      : size === "small"
      ? "px-4 py-1 text-xs font-medium"
      : "px-6 py-2 text-sm font-medium"; // default

  if (type === 'signup') {
    return (
      <button onClick={onClick}
        className={`bg-[#ff6b6b] text-white rounded-md font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_0_10px_2px_rgba(255,107,107,0.6)] ${sizeClasses}`}
      >
        {children}
      </button>
    );
  } else if (type === "login") {
    return (
      <button onClick={onClick}
        className={`hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[2px] cursor-pointer border border-white/30 rounded-md text-white font-medium hover:bg-white/5 hover:border-white transition-all duration-300 ${sizeClasses}`}
      >
        {children}
      </button>
    );
  } else if (type === "middle" && href) {
    return (
      <a href={href} onClick={onClick} className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 px-4 h-16 flex items-center relative group">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b6b] transition-all duration-300 group-hover:w-full"></span>
      </a>
    );
  } else if (type === "middle" && !href) {
    return (
      <button className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 px-4 h-16 flex items-center relative group">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b6b] transition-all duration-300 group-hover:w-full"></span>
      </button>
    );
  }
}
