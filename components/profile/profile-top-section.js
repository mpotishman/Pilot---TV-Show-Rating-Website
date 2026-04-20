'use client';
import React, { useState } from "react";
import Image from "next/image";
import TabButtons from "../buttons/tab-buttons";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function ProfileTopSection({
  profileInfo,
  currentViewedProfile,
  canEdit
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const bio = profileInfo?.bio || null;
  const viewingOwnProfile = String(profileInfo?.id) === String(currentViewedProfile);

  // find out what active tab the user is on
  const activeTab = searchParams?.get("tab") || "watched";

  const handleTabClick = (tab) => {
    // create a mutable copy and set tab
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };






  return (
    <div className="w-full bg-[#0a0e17]  border-b border-zinc-700">
      {/* NOTE: make this inner container relative so the absolute tab bar is positioned to it */}
      <div className="max-w-7xl mx-auto px-8 py-12 relative pb-20">
        <div className="flex gap-8 items-center">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full overflow-hidden relative flex-shrink-0 border-2 border-zinc-700">
            <Image
              src="/images/newprofile.jpg"
              fill
              alt="profile"
              className="object-cover"
            />
          </div>

          {/* Middle Section */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              {profileInfo?.username}
            </h1>

            {/* Bio logic */}
            {bio ? (
              <p className="text-gray-400 mb-4 text-base">{bio}</p>
            ) : canEdit ? (
              <button className="text-[#ff6b6b] hover:text-[#ff5252] transition-colors mb-4 text-sm font-medium">
                Add Bio +
              </button>
            ) : null}

            {/* User Stats */}
            <div className="flex gap-8 text-sm">
              <div>
                <span className="font-semibold text-white text-lg">
                  {profileInfo?.shows_watched ?? 0}
                </span>
                <span className="text-gray-500 ml-1">Shows watched</span>
              </div>
              <div>
                <span className="font-semibold text-white text-lg">
                  {profileInfo?.episodes_watched ?? 0}
                </span>
                <span className="text-gray-500 ml-1">Episodes watched</span>
              </div>
              <div>
                <span className="font-semibold text-white text-lg">
                  {profileInfo?.hours_watched ?? 0}
                </span>
                <span className="text-gray-500 ml-1">Hours watched</span>
              </div>
            </div>
          </div>

          {/* Right Section (Edit Profile button if own profile) */}
          <div className="flex-shrink-0">
            {canEdit && (
              <button className="px-6 py-2 bg-[#1f2937] border border-zinc-600 rounded-lg text-white hover:bg-[#2d3748] transition-colors">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* absolute tab bar anchored to the bottom of this .max-w-7xl container */}
        <div className="absolute bottom-0 left-0 w-full flex gap-4 px-4 justify-center border-t border-zinc-700 bg-gradient-to-t from-transparent to-transparent">
          <TabButtons
            active={activeTab === "watched"}
            onClick={() => handleTabClick("watched")}
          >
            Watched
          </TabButtons>

          <TabButtons
            active={activeTab === "watchlist"}
            onClick={() => handleTabClick("watchlist")}
          >
            Watchlist
          </TabButtons>

          <TabButtons
            active={activeTab === "ratings"}
            onClick={() => handleTabClick("ratings")}
          >
            Ratings
          </TabButtons>

          <TabButtons
            active={activeTab === "lists"}
            onClick={() => handleTabClick("lists")}
          >
            Lists
          </TabButtons>

          <TabButtons
            active={activeTab === "activity"}
            onClick={() => handleTabClick("activity")}
          >
            Activity
          </TabButtons>
        </div>
      </div>
    </div>
  );
}
