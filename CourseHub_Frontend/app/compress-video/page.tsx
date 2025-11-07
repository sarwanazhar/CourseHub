'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function CompressVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compressedVideoUrl, setCompressedVideoUrl] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId || '');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/video-compressing`, formData, {
        onUploadProgress: progressEvent => {
          const totalLength = progressEvent.total ?? 0;
          if (totalLength > 0) {
            setProgress(Math.round((progressEvent.loaded * 100) / totalLength));
          }
        }
      });

      if (response.status === 200) {
        setCompressedVideoUrl(response.data.videoUrl);
        console.log(response.data);
      } else {
        console.error('Failed to compress and upload video:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error during video upload:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detailed error:', error.response.data);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Button
          variant="ghost"
          className="text-gray-50"
          onClick={() => router.push('/')}
        >
          ← Back to Home
        </Button>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-50">Compress Your Video</h1>  
            <p className="mt-2 text-gray-400">Upload a video file to compress and get a download link for the compressed video <br /> (compressing takes time dont close page)</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="bg-gray-700 text-gray-50"
              />
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-400 text-center">{progress}% - uploading video...</p>
              </div>
            )}
            {compressedVideoUrl && (
              <div className="text-center">
                <p className="text-green-400 mb-2">Video compressed successfully!</p>
                <Button asChild className="w-full">
                  <a href={compressedVideoUrl} download>Download Compressed Video</a>
                </Button>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={!file || isUploading}
            >
              {isUploading ? 'compressing...' : 'Upload Video'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

