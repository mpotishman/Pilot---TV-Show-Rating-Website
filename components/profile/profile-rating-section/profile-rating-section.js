// ProfileRatingSection.jsx
import React from 'react'
import RatingCard from './rating-card'

export default function ProfileRatingSection({ ratingInformation }) {
  return (
    <div className='p-4 bg-gradient-to-br from-[#0a0e17] to-[#1a1f2e] flex flex-col gap-4 w-full items-center'>
      <div className='w-full max-w-4xl'>
        {ratingInformation.map(item => (
          <RatingCard
            key={`${item.show_id ?? item.id}.${item.created_at ?? item.createdAt}`}
            rating={item}
          />
        ))}
      </div>
    </div>
  )
}