"use client";

import Image from "next/image";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavBarButtons from "../buttons/nav-bar-buttons";
import { login, logout } from "@/actions/auth-actions";

import { motion, AnimatePresence } from "motion/react";
import NavProfileButtons from "./nav-profile-buttons";
import LogInModal from "../modal/log-in-modal";
import SearchBar from "./search-bar";

export default function NavigationBar({ isLoggedIn, profileData }) {
  // later, take in parameter to see if logged in - the if not logged in, return below, else add another return statement with a different navbar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // check if user on landing, if they are not then have the top buttons redirect them there
  const pathname = usePathname();
  const landing = pathname === "/";

  // create a useState for calling the log in modal, either to have it be to the signup page or the login page of it
  const [loginModal, setLoginModal] = useState(false);
  const [signupmodal, setSignupModal] = useState(false);

  let content;

  if (isLoggedIn) {
    content = (
      <header className="text-zinc-200">
        <nav className="sticky flex top-0 bg-[#0a0e17]/95 border-b border-zinc-700 shadow-sm z-50">
          {/* Logo future and website name div time */}
          <div className="flex items-center p-2 gap-2">
            <Image
              src="/images/newerplane.png"
              width={120}
              height={40}
              alt={"logo"}
            />
            <div className="font-bold text-2xl">
              <Link href="/" className="inline-block">
                pilot
              </Link>
            </div>
          </div>

          {/* Computer Nav Screen - Middle section */}
          {/* When user presses one of these buttons, instead of being taken to a new page, simply scroll the screen down to that section of the landing */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6 border-red-400">
            <SearchBar />
          </div>

          {/* Right side - handles both mobile and desktop buttons */}
          <div className="flex flex-1 md:flex-initial items-center justify-end gap-4 pr-4">
            {/* Profile section */}
            <div className="relative group">
              <button className="w-9 h-9 bg-blue-600 rounded-full border-2 border-transparent hover:scale-105 hover:border-highlight transition-all flex items-center justify-center font-semibold text-sm overflow-hidden relative">
                <Image
                  src="/images/newprofile.jpg"
                  fill
                  alt="profile"
                  className="object-cover"
                />
              </button>

              {/* dropdown section, when parent div with group is hovered over opacity here becomes 1 */}
              <div className="absolute top-full right-0 mt-3 min-w-[220px] bg-[#161d29] border border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 -translate-y-2 group-hover:translate-y-0 before:content-[''] before:absolute before:-top-1.5 before:right-3 before:w-3 before:h-3 before:bg-[#161d29] before:border-l before:border-t before:border-white/10 before:rotate-45">
                {/* top section */}
                <div className="top-section p-4 tracking-tight flex flex-col">
                  <p className="text-white font-bold text-lg">
                    {profileData.user.username}
                  </p>
                  <p className=" font-bold text-sm text-customGrey">
                    {profileData.user.email}
                  </p>
                  <p className=" font-bold text-sm text-customGrey">
                    {profileData.user.id}
                  </p>
                </div>
                <div className="border-t border-gray-700 "></div>
                {/* user sections */}
                <div className="flex flex-col text-sm">
                  <NavProfileButtons
                    icon={"👤"}
                    content={"Your Profile"}
                    href={`/profile/${profileData.user.username}`}
                  ></NavProfileButtons>
                  <NavProfileButtons icon={"📊"} content={"Your Watched Shows"} href={`/profile/${profileData.user.username}?tab=watched`}/>
                  <NavProfileButtons icon={"📝"} content={"Your Watchlist"} href={`/profile/${profileData.user.username}?tab=watchlist`}/>
                  <NavProfileButtons icon={"🔖"} content={"Your Ratings"} href={`/profile/${profileData.user.username}?tab=ratings`}/>
                  <NavProfileButtons icon={"🔖"} content={"Your Lists"} href={`/profile/${profileData.user.username}?tab=lists`}/>
                  <NavProfileButtons icon={"🔖"} content={"Your Activity"} href={`/profile/${profileData.user.username}?tab=activity`}/>
                </div>
                <div className="border-t border-gray-700 my-2"></div>

                {/* settings section */}
                <div className="flex flex-col text-sm">
                  <NavProfileButtons icon={"⚙️"} content={"Settings"} href={`/profile/${profileData.user.username}`}/>
                  <NavProfileButtons icon={"❓"} content={"Help Center"} href={`/profile/${profileData.user.username}`}/>
                </div>
                <div className="border-t border-gray-700 my-2"></div>

                {/* Logout section */}
                <div className="w-full flex items-center gap-3 px-5 py-3 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                  <form className="flex flex-row gap-3" action={logout}>
                    <p>🚪</p>
                    <button>Log Out</button>
                  </form>
                </div>
              </div>
            </div>

            {/* Mobile navigation navbar */}
            {/* Set it as hidden on medium screens and above, the hamburger menu */}
            <div className="md:hidden flex items-center gap-4">
              
              {/* When hamburger pressed, set mobileMenuOpen to the opposite of what it just was */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex flex-col justify-center items-center w-8 h-8 relative"
              >
                <span
                  className={`block w-8 h-1 bg-zinc-200 rounded transition-transform duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block w-8 h-1 bg-zinc-200 rounded my-1 transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block w-8 h-1 bg-zinc-200 rounded transition-transform duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>
            </div>

            {/* Now for the content when mobileMenuOpen is truthy */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-full left-0 w-full flex flex-col bg-[#0a0e17]/95 z-50 overflow-hidden"
                >
                  <NavBarButtons type="middle" href="#features">
                    Features
                  </NavBarButtons>
                  <NavBarButtons type="middle" href="#trending">
                    Trending
                  </NavBarButtons>
                  <NavBarButtons type="middle" href="#about">
                    About
                  </NavBarButtons>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>
    );
  } else {
    content = (
      <header className="text-zinc-200">
        <nav className="sticky flex top-0 bg-[#0a0e17]/95 border-b border-zinc-700 shadow-sm z-50">
          {/* Logo future and website name div time */}
          <div className="flex items-center p-2 gap-2">
            <Image
              src="/images/newerplane.png"
              width={120}
              height={40}
              alt={"logo"}
            />
            <div className="font-bold text-2xl">
              <Link href="/" className="inline-block">
                pilot
              </Link>
            </div>
          </div>

          {/* Computer Nav Screen - Middle section */}
          {/* When user presses one of these buttons, instead of being taken to a new page, simply scroll the screen down to that section of the landing */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6">
            <NavBarButtons
              type="middle"
              href={landing ? "#features" : "/#features"}
            >
              Features
            </NavBarButtons>
            <NavBarButtons
              type="middle"
              href={landing ? "#trending" : "/#trending"}
            >
              Trending
            </NavBarButtons>
            <NavBarButtons type="middle" href={landing ? "#about" : "/#about"}>
              About
            </NavBarButtons>
          </div>

          {/* Right side - handles both mobile and desktop buttons */}
          <div className="flex flex-1 md:flex-initial items-center justify-end gap-4 pr-4">
            {/* Desktop - Log In and Sign Up buttons */}
            <div className="hidden md:flex items-center gap-4">
              <NavBarButtons onClick={() => setLoginModal(true)} type="login">
                Log In
              </NavBarButtons>
              <NavBarButtons onClick={() => setSignupModal(true)} type="signup">
                Sign Up
              </NavBarButtons>
            </div>

            {/* Mobile navigation navbar */}
            {/* Set it as hidden on medium screens and above, the hamburger menu */}
            <div className="md:hidden flex items-center gap-4">
              <div>
                <NavBarButtons type="signup">Sign Up</NavBarButtons>
              </div>
              {/* When hamburger pressed, set mobileMenuOpen to the opposite of what it just was */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex flex-col justify-center items-center w-8 h-8 relative"
              >
                <span
                  className={`block w-8 h-1 bg-zinc-200 rounded transition-transform duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block w-8 h-1 bg-zinc-200 rounded my-1 transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block w-8 h-1 bg-zinc-200 rounded transition-transform duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>
            </div>

            {/* Now for the content when mobileMenuOpen is truthy */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-full left-0 w-full flex flex-col bg-[#0a0e17]/95 z-50 overflow-hidden"
                >
                  <NavBarButtons type="middle" href="#features">
                    Features
                  </NavBarButtons>
                  <NavBarButtons type="middle" href="#trending">
                    Trending
                  </NavBarButtons>
                  <NavBarButtons type="middle" href="#about">
                    About
                  </NavBarButtons>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>
    );
  }

  // Not logged in nav bar
  return (
    <>
      {content}

      {loginModal && (
        <LogInModal onClose={() => setLoginModal(false)} standalone={true} />
      )}

      {signupmodal && (
        <LogInModal onClose={() => setSignupModal(false)} standalone={true} />
      )}
    </>
  );
}
