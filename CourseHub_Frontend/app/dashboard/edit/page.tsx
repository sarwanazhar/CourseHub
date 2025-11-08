'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

export default function EditProfile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if unauthenticated and set initial name
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (status === 'authenticated') {
      setName(session?.user?.name || '')
      setIsLoading(false)
    }
  }, [status, session, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('id', session?.user.id as string)
    if (file) formData.append('file', file)

    try {
      if (file) {
        console.log(formData.values)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, formData)
        console.log(response)
      } else {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update/withoutfile`, {
          name,
          id: session?.user.id
        })
        console.log(response)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      await update()
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gray-50 w-44 h-44" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-50 mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <Label htmlFor="name" className="text-gray-200">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 bg-gray-800 text-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="file" className="text-gray-200">Profile Picture (optional)</Label>
            <Input
              id="file"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="bg-gray-700 text-gray-50"
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
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
