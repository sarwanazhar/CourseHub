'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from 'next-auth/react'
import axios from 'axios'


export default function UploadVideoPage() {
  const [title, setTitle] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const {data: session} = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', videoFile)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('userId', session?.user?.id || '')
      formData.append('courseId', params.id as string)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/video`, formData)
      console.log('response', response)

    } catch (error) {
      console.log('error uploading video', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <main className="flex-1 container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-50 mb-6">Upload Video to Course</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200">Video Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 bg-gray-800 text-gray-50"
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-200">Video File</label>
            <Input
              id="file"
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e)}
              required
              className="mt-1 bg-gray-800 text-gray-50"
            />
            <p className="mt-1 text-sm text-gray-400">Maximum file size: 100MB</p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-200">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 bg-gray-800 text-gray-50"
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
            <Link href="/compress-video" className="text-blue-400 hover:underline">
              Need to compress your video?
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

