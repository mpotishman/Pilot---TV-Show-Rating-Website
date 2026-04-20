'use client';
import React from 'react'
import CastCard from './cast-card';

export default function ShowCastSection({ showInfo, castInfo }) {
  return (
    <section className="flex flex-col p-4">
      <div className="flex flex-col gap-4 mt-4 tracking-tight">
        <span className="text-3xl font-bold text-white">Cast & Crew</span>
        <span className="text-lg text-customGrey">Main cast members from {showInfo.name}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 items-center">
        {castInfo.cast.slice(0, 10).map((actor) => (
          <CastCard key={actor.id} castInfo={actor} />
        ))}
      </div>
    </section>
  );
}
