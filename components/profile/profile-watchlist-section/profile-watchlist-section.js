import React from 'react'
import WatchlistShowCard from './watchlist-show-cards'

export default function ProfileWatchlistSection({watchlistedShows}) {
  return (
    <div className='watchlisted-container flex flex-col gap-4 p-4 tracking-tight w-full items-center'>
      {watchlistedShows.map(show => (
        <WatchlistShowCard key={show.id} showInfo={show} />
      ))}
    </div>
  )
}
