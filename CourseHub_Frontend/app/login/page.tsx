'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { AnimatedStars } from '@/components/animatedStars';

export default function LoginPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/');
    }
  }, [session, router]);

  // Display loading state if session is loading
  if (session.status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen bg-black">
      <Loader2 className="w-44 h-44 animate-spin" />
    </div>;
  }

  console.log(session);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <AnimatedStars />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 bg-zinc-800 py-12 rounded-lg shadow-lg z-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-50">Welcome to CourseHub</h1>
            <p className="mt-2 text-gray-400">Sign in to start learning or teaching</p>
          </div>
          <div className="mt-8 flex justify-center">
            <button type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55" onClick={() => signIn('google', { callbackUrl: '/' })}>
              <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
