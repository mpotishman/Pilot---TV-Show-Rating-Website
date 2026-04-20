import React from "react";

export default function Feature({ icon, title, description }) {
  return (
    <div className="feature-card w-full bg-[#161d29] border border-white/5 rounded-xl p-10 transition-transform duration-300 hover:-translate-y-1 hover:border-[#ff6b6b]/30 hover:shadow-lg">
      <div className="feature-icon text-4xl mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}