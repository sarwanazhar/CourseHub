'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function CreateCoursePage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const {data: session} = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!file) {
      setIsSubmitting(false)
      setError('Please upload an image')
      return;
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('price', price)
    formData.append('description', description)
    formData.append('file', file)
    formData.append('userId', session?.user?.id || '')

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course/create`, formData)
      console.log(response)

      if (response.status === 201) {
        setIsSubmitting(false)
        router.push('/courses/manage')
      }

    } catch (error) {
      console.log(error)
      setError('Failed to create course')
    }

    setIsSubmitting(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <main className="flex-1 container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-50 mb-6">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 bg-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-200">Thumbnail of the course</label>
            <Input
                id="file"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="bg-slate-400 text-gray-50"
              />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-200">Price in $ USD</label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 bg-gray-700 text-white"
              type="number"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 bg-gray-700 text-white"
              rows={4}
            />
          </div>
          {error && <p className="text-rose-500">{error}</p>}
          <Button className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </Button>
        </form>
      </main>
    </div>
  )
}

