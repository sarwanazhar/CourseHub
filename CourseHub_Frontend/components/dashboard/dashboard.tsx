'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { Button } from '../ui/button'

function DashboardComponent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
  }, [status, router])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!session?.user?.id) return

      try {
        const response = await api.get(`/course/user/${session.user.id}`)
        setCourses(response.data.courses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchCourses()
    }
  }, [session])

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-white w-44 h-44" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 lg:pr-8 mb-8 lg:mb-0 lg:sticky lg:top-28 self-start">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32"
              style={{
                backgroundImage: `url(${session?.user.image})`,
              }}
            />
            <div className="flex flex-col justify-center">
              <p className="text-white text-2xl font-bold">{session?.user?.name}</p>
              <p className="text-gray-400 text-base font-normal">{session?.user?.email}</p>
            </div>
          </div>
          <div className='mt-5 flex justify-center lg:justify-normal'>
            <Button
              onClick={() => router.push("/dashboard/edit")}
              className="flex h-9 px-4 py-2 bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors w-fit rounded-md"
            >
              Edit Profile
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 lg:pl-8 lg:border-l border-gray-800">
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-bold mb-6">My Courses</h2>

            {/* Courses List */}
            {courses.length > 0 ? (
              <div className="flex flex-col gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row-reverse items-stretch justify-between gap-6 rounded-lg border border-gray-800 p-4 hover:bg-gray-900/50 transition-colors duration-200"
                  >
                    <div
                      className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video bg-cover rounded-md"
                      style={{
                        backgroundImage: `url(${course.imageUrl})`,
                      }}
                    />
                    <div className="flex flex-[2_2_0px] flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-400 text-sm font-normal">
                          {course.status || 'Draft'}
                        </p>
                        <p className="text-white text-lg font-bold">
                          {course.title}
                        </p>
                        <p className="text-gray-400 text-sm font-normal">
                          {course.description || 'No description provided.'}
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push(`/courses/edit/${course.id}`)}
                        className="flex h-9 px-4 py-2 bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors w-fit rounded-md"
                      >
                        Edit Course
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-700 p-12 text-center">
                <div className="flex flex-col gap-2 items-center">
                  <h3 className="text-white text-lg font-bold">
                    You haven't created any courses yet
                  </h3>
                  <p className="text-gray-400 text-sm max-w-sm">
                    Start sharing your knowledge by creating your first course. It's easy to get started!
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/courses/create')}
                  className="flex h-10 px-5 bg-white text-black text-sm font-medium transition-colors hover:bg-gray-200 rounded-md text-center"
                >
                  Create Your First Course
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardComponent
