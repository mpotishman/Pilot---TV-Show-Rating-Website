import React from "react";
import Link from "next/link";

export default function NavProfileButtons({ icon, content, href }) {
  return (
    <Link href={href}>
      <div className="w-full flex items-center gap-3 px-5 py-3 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
        <p>{icon}</p>
        <p>{content}</p>
      </div>
    </Link>
  );
}
