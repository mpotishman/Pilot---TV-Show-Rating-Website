import React from 'react'

export default function SeasonButtons({children, onClick, active}) {
  return (
    <button onClick = {onClick} className={`py-3 px-8 text-[0.95rem] rounded-3xl transition-all duration-300 cursor-pointer ${active ? 'bg-[#ff6b6b] scale-105' : 'bg-[#1f2937]' } `}>
      {children}
    </button>
  )
}
