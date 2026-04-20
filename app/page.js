import { getTrending } from "@/actions/actions";
import React from "react";

import Hero from "@/components/hero-section/hero";
import FeaturesSection from "@/components/features/features-section";
import TrendingContainer from "@/components/trending/trending-container";
import { getCurrentUser } from "@/lib/auth";


export default async function Page() {
   // Check if user is logged in
  const currentUser = await getCurrentUser();
  const username = currentUser?.user?.username || null;

  return (
    <>
      <Hero username={username}/>
      <FeaturesSection />
      <TrendingContainer username={username} />
    </>
    
);

}
