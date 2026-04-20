import React from "react";

export default function LandingButtons({
  type = "signup",
  size = "default",
  children,
}) {
  // compute size classes based on the size prop
  const sizeClasses =
    size === "large"
      ? "px-10 py-4 text-lg font-bold"
      : size === "small"
      ? "px-4 py-1 text-xs font-medium"
      : "px-6 py-2 text-sm font-medium"; // default

  // early return based on the type prop
  if (type === "signup") {
    return (
      <button
        className={`bg-[#ff6b6b] text-white rounded-md font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_0_10px_2px_rgba(255,107,107,0.6)] ${sizeClasses}`}
      >
        {children}
      </button>
    );
  }

  // fallback (login or any other type)
  return (
    <button
      className={`hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[2px] cursor-pointer border border-white/30 rounded-md text-white font-medium hover:bg-white/5 hover:border-white transition-all duration-300 ${sizeClasses}`}
    >
      {children}
    </button>
  );
}
