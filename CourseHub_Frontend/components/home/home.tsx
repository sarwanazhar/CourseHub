'use client'
import Link from "next/link"

import { Button } from "../ui/button"
import { AnimatedStars } from "../animatedStars"
import { useRouter } from "next/navigation";
import AnimatedButton from "./AnimatedButton";

export const HomeComponent = () => {
  const router = useRouter();
  return (
    <>
      <main className=" w-full">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center overflow-x-hidden">
          <AnimatedStars />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-tl from-gray-300 via-gray-200/60 to-gray-700">
                  Welcome to CourseHub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Create, sell, and learn from courses. Join our community of educators and learners today.
                </p>
              </div>
              <div className="space-x-4 flex flex-row">
                <AnimatedButton theme="white" href="/about">Learn More</AnimatedButton>
                <AnimatedButton theme="black" href="/login">Get Started</AnimatedButton>
              </div>
            </div>
          </div>
        </section>
        <section className="w-screen py-12 md:py-24 lg:py-32 bg-transparent flex justify-center items-center ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap gap-10 justify-center items-center">
              {/* Card 1 */}
              <div className="flex flex-col items-center space-y-3 bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <svg
                  className="h-12 w-12 text-gray-50"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <h2 className="text-xl font-bold text-white">Create Courses</h2>
                <p className="text-sm text-gray-400 text-center">
                  Design and publish your own courses with ease.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center space-y-3 bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <svg
                  className="h-12 w-12 text-gray-50"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.4 10.6a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Z" />
                  <path d="M10.5 12.7a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 0 1-4.2 0Z" />
                  <path d="M12.7 10.6a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 0 1-4.2 0Z" />
                  <path d="M14.8 7.4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Z" />
                  <path d="M12.7 5.3a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Z" />
                </svg>
                <h2 className="text-xl font-bold text-white">Sell Your Knowledge</h2>
                <p className="text-sm text-gray-400 text-center">
                  Monetize your expertise by selling courses.
                </p>
              </div>

              {/* Add similar updated cards for the rest */}
              <div className="flex flex-col items-center space-y-3 bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <svg
                  className="h-12 w-12 text-gray-50"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m2 12 5.45 5.45" />
                  <path d="m12 6v6l4 2" />
                </svg>
                <h2 className="text-xl font-bold text-white">Learn Anytime</h2>
                <p className="text-sm text-gray-400 text-center">
                  Access courses 24/7 and learn at your own pace.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black flex justify-center items-center relative overflow-hidden mb-24">
          <AnimatedStars />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-50">
                  New Feature: Video Compression
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Compress your course videos to save space and improve streaming quality. Try our new video compression tool now!
                </p>
              </div>
              <button type="button" className="text-black bg-gradient-to-r from-white via-gray-200 to-gray-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-400 dark:focus:ring-gray-600 shadow-lg shadow-gray-400/50 dark:shadow-lg dark:shadow-gray-600/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 " onClick={() => {
                router.push("/compress-video");
              }}>Compress Your Video</button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
