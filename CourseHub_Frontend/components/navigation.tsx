'use client';

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { signOut, useSession } from 'next-auth/react';
import Sidebar from './sidebar';

export function Navbar() {
  const { data: session, status } = useSession(); 
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-transparent backdrop-blur-md z-50 fixed top-0 w-full">
      <Link className="flex items-center justify-center" href="/">
        <span className="sr-only">CourseHub</span>
        <svg
          className="h-6 w-6 text-gray-50"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <span className="ml-2 text-2xl font-bold text-gray-50">CourseHub</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {status === 'unauthenticated' && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
        {status === 'authenticated' && (
          <>
          <button onClick={() => signOut()} className='bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors'>
            Logout
          </button>
          <Sidebar />
          </>
        )}
      </nav>
    </header>
  )
}

