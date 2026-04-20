import React from 'react'
import ShowCard from '@/components/shows/show-card'

export default function ProfileWatchedSection({watchedShows}) {
  return (
    <div className="w-full bg-gradient-to-br from-[#0a0e17] to-[#1a1f2e] py-8">
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {watchedShows.map(show => (
              <ShowCard key={show.id} type='large' show={show} />
          ))}
        </div>
      </div>
    </div>
  )
}
