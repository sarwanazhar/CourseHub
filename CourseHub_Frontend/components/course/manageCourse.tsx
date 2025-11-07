'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Video, Loader2, SquareChartGantt } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

interface Course {
  id: number;
  title: string;
  students: number;
  courseRevenue: number;
  status: string;
  price: number;
  videos: any[];
  enrollments: {
    userId: number;
  }[];
}

export const ManageCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchCourses = async () => {
      if (session?.user?.id) {
        try {
          const response = await api.get(`/course/user/${session.user.id}`);
          const data = await response.data;
          setCourses(data.courses)
        } catch (error) {
          console.log('Error fetching courses:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    if (session?.user?.id) {
      fetchCourses()
    } else {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (typeof window !== 'undefined' && !session) {
      router.push('/login')
    }
  }, [session, router])

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteCourse = async (id: number) => {
    setCourses(courses.filter(course => course.id !== id))

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/delete/${id}`, {
        userId: session?.user?.id
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePublishCourse = async (id: number) => {
    const updatedCourses = courses.map(course =>
      course.id === id ? { ...course, status: 'PUBLISHED' } : course
    )
    setCourses(updatedCourses)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/publish/${id}`, {
        userId: session?.user?.id
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleInactiveCourse = async (id: number) => {
    const updatedCourses = courses.map(course =>
      course.id === id ? { ...course, status: 'INACTIVE' } : course
    )
    setCourses(updatedCourses)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/inactive/${id}`, {
        userId: session?.user?.id
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 mt-14">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-gray-300 via-gray-400 to-gray-500 flex items-center">
            <SquareChartGantt className="w-6 h-6 mr-2 text-white/80" />
            Manage Courses
          </h1>
          <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => router.push('/courses/create')}>Create New Course</button>
        </div>
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-950 text-gray-50 border-zinc-800"
          />
        </div>
        {isLoading ? (
          <div className="text-gray-50 min-h-screen flex justify-center items-center">
            <Loader2 className="w-44 h-44 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300 font-semibold">Course Title</TableHead>
                <TableHead className="text-gray-300 font-semibold">Videos</TableHead>
                <TableHead className="text-gray-300 font-semibold">Revenue</TableHead>
                <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-300">No courses found</TableCell>
                </TableRow>
              )}
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-gray-50">{course.title}</TableCell>
                  <TableCell className="text-gray-300">{course.videos?.length}</TableCell>
                  <TableCell className="text-gray-300">${course.enrollments.length * Number(course.price)}</TableCell>
                  <TableCell className="text-gray-300">{course.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/courses/edit/${course.id}`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/courses/upload/${course.id}`}>
                          <Video className="w-4 h-4 mr-2" />
                          Upload Video
                        </Link>
                      </Button>
                      {course.status === 'PUBLISHED' && (
                        <Button size="sm" className="bg-red-500 hover:bg-red-700 border-none text-white" variant="outline" onClick={() => handleInactiveCourse(course.id)}>
                          Unpublish
                        </Button>
                      )}
                      {course.status === 'INACTIVE' && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-700 border-none text-white px-5 py-2.5" variant="outline" onClick={() => handlePublishCourse(course.id)}>
                          Publish
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center" onClick={() => handleDeleteCourse(course.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800">
                          <DialogHeader>
                            <DialogTitle className="text-gray-50">Are you sure?</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              This action cannot be undone. This will permanently delete the course and remove the data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteCourse(course.id)}>
                              Delete Course
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  )
}
