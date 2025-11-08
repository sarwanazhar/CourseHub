'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
}

const CoursesComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { status } = useSession()
  const router = useRouter()

  if (status === 'unauthenticated') {
    router.push('/login')
    return null // Prevent rendering anything else
  }
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course/get-all`)
        setCourses(response.data.courses)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container px-4 py-8 bg-black w-screen">
      <h1 className="text-3xl font-bold text-gray-50 mb-6 mt-14">Explore Courses</h1>
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-zinc-900/50 text-gray-50 border-zinc-800"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="text-gray-50 text-2xl flex justify-center items-center min-h-screen">
            <Loader2 className="w-44 h-44 animate-spin" />
          </div>
        )}
        {filteredCourses?.length === 0 && !isLoading && (
          <div className="text-gray-50 min-h-screen">
            <p>There are no courses available</p>
          </div>
        )}

        {!isLoading && filteredCourses?.map((course) => (
          <Card key={course.id} className="bg-zinc-600/50 border-zinc-800 shadow-zinc-200/50">
            <CardHeader>
              <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover rounded-lg" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-bold text-gray-50 mb-2 lg:mb-1 capitalize">{course.title}</CardTitle>
              <p className="text-gray-400 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-50 font-bold">${course.price.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>View Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CoursesComponent;