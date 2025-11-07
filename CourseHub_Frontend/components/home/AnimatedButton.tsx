'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function AnimatedButton({ children, href, theme }: { children: React.ReactNode, href: string, theme: 'white' | 'black' }) {
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      button.style.setProperty('--mouse-x', `${x}px`)
      button.style.setProperty('--mouse-y', `${y}px`)
    }

    button.addEventListener('mousemove', handleMouseMove)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const themeClasses = theme === 'white' ? {
    bg: 'bg-white',
    hoverBg: 'hover:shadow-md',
    gradientFrom: 'from-gray-50',
    gradientTo: 'from-gray-100',
    text: 'text-gray-800',
    gradientVia: 'via-gray-200/30'
  } : {
    bg: 'bg-gray-800',
    hoverBg: 'hover:bg-gray-700',
    gradientFrom: 'from-gray-700',
    gradientTo: 'from-gray-600',
    text: 'text-gray-200',
    gradientVia: 'via-gray-600/30'
  }

  return (
    <Link
      ref={buttonRef}
      className={`group relative flex items-center justify-center overflow-hidden rounded-md ${themeClasses.bg} px-4 py-2 text-sm transition-all duration-300 ease-out ${themeClasses.hoverBg}`}
      href={href}
    >
      <span className={`absolute inset-0 h-full w-full bg-gradient-to-br ${themeClasses.gradientFrom} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <span className={`absolute -inset-px rounded-md bg-gradient-to-br ${themeClasses.gradientTo} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <span className="relative flex items-center justify-center">
        <span className="sr-only">{children}</span>
        <span className={`ml-2 text-base font-semibold ${themeClasses.text}`}>{children}</span>
      </span>
      <span
        className={`absolute inset-0 h-[200px] w-[200px] bg-gradient-to-r from-transparent ${themeClasses.gradientVia} to-transparent opacity-0 transition-all duration-500 ease-out group-hover:opacity-100`}
        style={{
          transform: 'rotate(45deg) translate(-50%, -50%)',
          left: 'var(--mouse-x)',
          top: 'var(--mouse-y)',
        }}
      />
    </Link>
  )
}
