// app/scroll-to-top.js
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Multiple methods to ensure scroll reset
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Also try with a slight delay for hydration
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [pathname])

  return null
}