'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Course {
  id: number
  courseName: string
  courseDescription: string
  courseImageUrl: string
  courseId: string
}

export default function MyCoursesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [boughtCourses, setBoughtCourses] = useState<Course[] | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!session?.user.id) return;
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/enrolled/${session.user.id}`)
        console.log(response.data)
        setBoughtCourses(response.data.enrolledCourses)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        setBoughtCourses([])
      }
    }
    fetchCourses()
  }, [session?.user.id])

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-44 h-44 animate-spin' />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null // Prevent rendering anything else
  }

  const handleCourseSelect = (courseId: string) => {
    router.push(`/courses/enrolled/${courseId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black w-full">
      <main className="flex-grow container mx-auto px-4 py-8 w-full mt-12">
        <h1 className="text-3xl font-bold text-gray-50 mb-6">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!boughtCourses && (
            <div>
              <Loader2 className='w-44 h-44 animate-spin' />
            </div>
          )}
          {boughtCourses && boughtCourses.length === 0 && (
            <div className='text-gray-500 mx-auto text-3xl lg:text-5xl w-screen'>
              <p>You have not bought any courses yet</p>
            </div>
          )}
          {boughtCourses && boughtCourses.length > 0 && boughtCourses.map((course) => (
            <Card key={course.id} className="bg-zinc-800 shadow-lg border-zinc-600">
              <CardHeader>
                <Image
                  src={course.courseImageUrl}
                  alt={course.courseName}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-gray-50">{course.courseName}</CardTitle>
                <CardDescription className="text-gray-300 mt-2">{course.courseDescription}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleCourseSelect(course.courseId)}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
          ))}   
        </div>
      </main>
    </div>
  )
}
