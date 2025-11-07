'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructor: string;
  videoCount: number;
  price: number;
  userId: string;
  isEnrolled: boolean;
}

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login'
    }
  }, [status])


  console.log(`This is the course id: ${params.id}`);

  useEffect(() => {
    if (!params.id) return; // Guard against undefined courseId

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course/${params.id}?user_id=${userId}`)
        setCourse(response.data)
      } catch (error) {
        console.error('Error fetching course:', error)
        setError('Failed to load course details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourse()
  }, [params.id])

  const handleBuyNow = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/enrolled`, {
        userId: session?.user?.id,
        courseId: params.id
      })
      router.push(response.data.url)
    } catch (error) {
      console.error('Error purchasing course:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-500 w-44 h-44" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{course?.title}</CardTitle>
          <CardDescription>By {course?.instructor}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={course?.imageUrl} 
              alt={course?.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-800">{course?.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{course?.videoCount} videos</span>
            <span className="text-2xl font-bold">${course?.price.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
        {
          course?.userId === userId ? (
            <Button className="w-full" disabled>You are the instructor</Button>
          ) : course?.isEnrolled ? (
            <Button className="w-full" disabled>Already purchased</Button>
          ) : (
            <Button className="w-full" onClick={handleBuyNow}>Buy Now</Button>
          )
        }
        </CardFooter>
      </Card>
    </div>
  )
}
