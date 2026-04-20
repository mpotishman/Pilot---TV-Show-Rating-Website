import React from "react";
import Feature from "./feature";

export default function FeaturesSection() {
  const features = [
    {
      icon: "📺",
      title: "Track Every Episode",
      description:
        "Never lose track of where you are in a series. Mark episodes as watched and see your progress at a glance.",
    },
    {
      icon: "⭐",
      title: "Rate & Review",
      description: "Share your thoughts on every episode. Rate individual episodes, not just entire seasons.",
    },
    {
      icon: "🎯",
      title: "Smart Recommendations",
      description: "Get personalized show recommendations based on your unique taste and viewing history.",
    },
    {
      icon: "📊",
      title: "Your Stats",
      description: "See your watching patterns, favorite genres, and get your year-in-review wrapped.",
    },
    {
      icon: "👥",
      title: "Connect with Friends",
      description: "See your watching patterns, favorite genres, and get your year-in-review wrapped.",
    },
    {
      icon: "📝",
      title: "Create Lists",
      description: "Curate custom watchlists and share your collections with the community.",
    },
  ];

  return (
    <section id='features' className="features py-12 px-6 bg-[#0f1419]">
      <div className="features-container max-w-[1200px] mx-auto text-center">
        {/* Section title */}
        <h2 className="section-title text-white font-bold text-4xl mb-4">
          Features
        </h2>

        {/* Section subtitle */}
        <p className="section-subtitle text-gray-400 max-w-lg mx-auto mb-16">
          Discover everything our app has to offer to make your TV experience
          seamless and fun.
        </p>

        {/* Grid container for feature cards */}
        <div
          className="
            features-grid
            grid
            gap-8
            grid-cols-1             /* Default: 1 column on very small screens (mobile) */
            sm:grid-cols-2          /* ≥640px (sm breakpoint): switch to 2 columns */
            md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] 
                                    /* ≥768px (md breakpoint): 
                                       auto-fit: as many columns as can fit
                                       min width 280px: card won’t shrink below this
                                       1fr: card grows to fill available space
                                     */
          "
        >
          {features.map((feature, idx) => (
            <Feature key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
