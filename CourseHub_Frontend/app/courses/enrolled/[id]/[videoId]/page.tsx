'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import axios from 'axios'

const fetchModuleData = async (courseId: string, moduleId: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/enrolled/${courseId}/videos/${moduleId}`)

  console.log(response.data)

  return {
    id: response.data.video.id,
    title: response.data.video.title,
    videoUrl: response.data.video.videoUrl
  }
}

export default function VideoPlayerPage() {
  const params = useParams()
  const courseId = params.id
  const moduleId = params.videoId
  const [module, setModule] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  

  useEffect(() => {
    const loadModuleData = async () => {
      const moduleData = await fetchModuleData(courseId as string, moduleId as string)
      setModule(moduleData)
      setIsLoading(false)
    }

    loadModuleData()
  }, [params.courseId, params.moduleId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <Loader2 className="w-44 h-44 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => router.push(`/courses/enrolled/${courseId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <h1 className="text-3xl font-bold text-gray-50 mb-2">{module.title}</h1>
        </div>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-50 text-xl">Video Player</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <video 
                className="w-full h-full"
                controls
                controlsList="nodownload"
                disablePictureInPicture
                src={module.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

