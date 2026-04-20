import React from "react";
import Image from "next/image";
import { getPopular } from "@/actions/actions";
import NavBarButtons from "../buttons/nav-bar-buttons";
import ShowCard from "../shows/show-card";
import LandingButtons from "../buttons/landing-buttons";

export default async function Hero({username}) {
  let data;
  try {
    data = await getPopular();
  } catch (error) {
    console.error(error);
    return <p>Failed to get data</p>;
  }

  const results = data?.results ?? [];
  const [firstShow, ...otherShows] = results.slice(0, 6);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] bg-gradient-to-br from-[#0a0e17] via-[#0a0e17] to-[#1a1f2e] pt-8 md:pt-12"
    >
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* OUTER wrapper: overflow-visible so title can protrude below the image.
            pb-* reserves space so following normal-flow content appears below the overlapped title */}
        <div className="relative w-full pb-14 md:pb-20 overflow-visible">
          {/* image clipper (rounded + overflow-hidden for corners) */}
          <div className="relative w-full h-80 md:h-[500px] rounded-lg overflow-hidden">
            {firstShow?.backdrop_path ? (
              <>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280${firstShow.backdrop_path}`}
                  alt={firstShow.name ?? firstShow.title ?? "show backdrop"}
                  fill
                  sizes="100vw"
                  className="object-cover object-top scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[rgba(10,14,23,0.5)] to-transparent pointer-events-none z-10" />

                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "radial-gradient(circle at center, transparent 0%, transparent 35%, rgba(10,14,23,1) 100%)",
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white">
                No image available
              </div>
            )}
          </div>

          {/* ONLY THE TITLE overlaps the image */}
          <h2
            className="absolute left-1/2 -translate-x-1/2 -bottom-0 z-30 whitespace-nowrap text-white font-bold tracking-wide px-4 text-center"
            style={{ fontSize: "clamp(2rem, 8vw, 5rem)" }}
          >
            Discover. Watch. <span className="text-[#ff6b6b]">Rate.</span>
          </h2>
        </div>

        {/* Normal-flow content below the image + overlapped title */}
        <div className="mt-1 md:mt-2 max-w-3xl mx-auto text-center">
          <p className="text-xl text-white/90 px-4">
            Your personal TV show companion. Track what you watch, rate every
            episode, and discover your next binge-worthy series.
          </p>

          <div className="flex gap-6 items-center justify-center mt-6">
            <LandingButtons type="signup" size='large'>
              Get Started Free
            </LandingButtons>
            <LandingButtons type="login" size="large">
              Explore Shows
            </LandingButtons>
          </div>
        </div>

        {/* Show cards */}
        <div className="mt-10 flex gap-5 items-start justify-center flex-wrap overflow-hidden">
          {otherShows.map((show) => (
            <ShowCard type="small" username={username} key={show.id} show={show} />
          ))}
        </div>
      </div>
    </section>
  );
}
