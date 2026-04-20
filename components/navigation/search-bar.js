import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [clicked, setClicked] = useState(false);
  const [enter, setEntered] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If click is outside the search bar, close it
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={searchRef}
      className={`relative border-b border-customGrey py-3 px-4 hover:scale-105 transition-all ${
        clicked ? "border-highlight" : ""
      }`}
    >
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer transform-[scaleX(-1)]"
        onClick={() => setEntered(true)}
      />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10"
        onClick={() => setClicked(true)}
        value={query}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEntered(true);
          }
        }}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
