'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
}



export default function EditCoursePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const {data: session} = useSession()


const fetchCourseData = async (courseId: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course/${courseId}?user_id=${session?.user.id}`)
    const course = response.data;
    return {
    id: course.id,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
      price: course.price,
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
    return null;
  } finally {
    setIsLoading(false)
  }
}


  useEffect(() => {
    const loadCourseData = async () => {
      const courseData = await fetchCourseData(params.id as string)
      if (courseData) {
        setTitle(courseData.title)
        setDescription(courseData.description)
        setFile(null)
        setPrice(courseData.price.toString())
      }
      setIsLoading(false)
    }

    loadCourseData()
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('userId', session?.user?.id || '')
    if (file) {
      formData.append('file', file)
    }

    try {
      if (file) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/update/${params.id}`, formData)
        console.log(response)
      } else {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/update-without-file/${params.id}`, {
          title,
          description,
          price,
          userId: session?.user?.id
        })
        console.log(response)
      }
    } catch (error) {
      console.error('Error updating course:', error)
    } finally {
      setIsSaving(false)
      router.push('/courses/manage')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 items-center justify-center">
        <Loader2 className="animate-spin text-gray-50 w-44 h-44" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-50 mb-6">Edit Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <Label htmlFor="title" className="text-gray-200">Course Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 bg-gray-800 text-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-200">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 bg-gray-800 text-gray-50"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="file" className="text-gray-200">Image URL (optional)</Label>
            <Input
                id="file"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="bg-gray-700 text-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-gray-200">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="mt-1 bg-gray-800 text-gray-50"
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push('/manage-courses')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

