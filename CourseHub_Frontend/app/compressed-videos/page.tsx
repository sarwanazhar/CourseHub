'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Download, Loader2, Meh } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface CompressedVideo {
  id: number
  videoSize: string
  originalSize: string
  compressionRate: string
  date: string
  videoUrl: string
}


function formatFileSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}


export default function CompressedVideosPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<CompressedVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if(status === 'unauthenticated'){
    return window.location.href = '/login'
  }

  const handleDownload = (videoUrl: string) => {
    router.push(videoUrl)
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${session.user.id}`)
          console.log(response.data)
          setUserData(response.data.compressedVideos)
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }
    fetchUser()
  }, [status, session])



  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-50">Compressed Videos</h1>
          <Button asChild>
            <Link href="/compress-video">Compress New Video</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading && (
            <div className="text-gray-50 min-h-screen flex justify-center items-center">
              <Loader2 className="w-44 h-44 animate-spin" />
            </div>
          )}
          {userData.length === 0 && !isLoading && (
            <div className="text-zinc-800 min-h-[50vh] flex justify-center items-center text-5xl">
              You don't have any video compressed yet 
              <Meh className="w-24 h-24 ml-2" />
            </div>
          )}
          {userData.map((video) => (
            <div key={video.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  <p>Original Size: <span className="text-rose-500">{formatFileSize(parseFloat(video.originalSize)) }</span></p>
                  <p>Compressed Size: <span className="text-green-500 font-bold">{video.videoSize} MB</span></p>
                  <p>Compression Rate: <span className="text-green-500 font-bold">{video.compressionRate}</span></p>
                  <p>Date Compressed: {video.date}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(video.videoUrl)}
                  className="text-zinc-800 border-gray-50 hover:bg-gray-700 hover:text-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
