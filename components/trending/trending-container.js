import React from "react"
import { getPopular } from "@/actions/actions"
import ShowCard from "../shows/show-card"

export default async function TrendingContainer({username}) {
  let data
  try {
    data = await getPopular()
  } catch (error) {
    console.error(error)
    return <p>Failed to get data</p>
  }

  const results = data?.results ?? []
  const trendingShows = results.slice(0, 8) // 8 cards = 4x2 grid on large screens

  return (
    <section
      id="trending"
      className="relative w-full bg-gradient-to-br from-[#0a0e17] via-[#0a0e17] to-[#1a1f2e] pt-8 md:pt-12 pb-12"
    >
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Trending this week
          </h2>
          <button className="text-[#ff6b6b] font-bold">View All →</button>
        </div>

        {/* Grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
          {trendingShows.map(show => (
            <ShowCard key={show.id} type ='large' show={show} username={username} />
          ))}
        </div>
      </div>
    </section>
  )
}
