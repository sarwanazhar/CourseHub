'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, ArrowLeft, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

interface Course {
  course: {
    id: string
    title: string
    description: string
    imageUrl: string | null
  }
  modules: {
    id: string
    title: string
    videoUrl: string
  }[]
}



export default function CourseContentPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const {data: session, status} = useSession();
  const userId = session?.user?.id;


  useEffect(() => {
    const loadCourseData = async () => {
      if(status === 'loading') {
        return
      }
      if(status === 'unauthenticated') {
        router.push('/login')
        return
      }
      if (true) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/enrolled/course/${params.id}`)
          setCourse(response.data)
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching course data:', error)
        }
      }
    }

    loadCourseData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="w-44 h-44 animate-spin mx-auto text-white" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => router.push('/courses/enrolled')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Courses
        </Button>
        <Card className="bg-gray-600 mb-6">
          <CardHeader>
            <Image  
              src={course?.course.imageUrl || 'test'}
              alt={course?.course.title || 'image'}
              width={600}
              height={300}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-gray-50 text-2xl mb-2">{course?.course.title}</CardTitle>
            <CardDescription className="text-gray-300">{course?.course.description}</CardDescription>
          </CardContent>
        </Card>
        <h2 className="text-2xl font-bold text-gray-50 mb-4">Course Modules</h2>
        <div className="space-y-4">
          {course?.modules.map((module: any) => (
            <Card key={module.id} className="bg-gray-600">
              <CardHeader>
                <CardTitle className="text-gray-50">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => router.push(`/courses/enrolled/${params.id}/${module.id}`)}>
                  <Play className="w-4 h-4 mr-2" />
                  Start video
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

