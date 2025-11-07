'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { useEffect, useState } from 'react'

const PaymentSuccessPage = () => {
  const params = useParams()
  const sessionId = params.id
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      const verifyPayment = async () => {
        setIsLoading(true)
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-payment?session_id=${sessionId}`)
          console.log("response", response)

          if (response.data.success) {
            setIsSuccess(true)
          } else {
            setIsSuccess(false)
            setError('Payment verification failed. Please try again later.')
          }
        } catch (error) {
          console.error("Error verifying payment:", error)
          setError('An error occurred while verifying payment. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }

      verifyPayment()
    }
  }, [sessionId])

  return (
      <div className="flex flex-col min-h-screen bg-gray-900 justify-center items-center px-4">
        {isLoading ? (
          <Loader2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-spin" />
        ) : isSuccess ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-50 mb-2">Payment Successful!</h1>
            <p className="text-xl text-gray-300 mb-8">Thank you for your purchase. Your course is now available.</p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/courses/enrolled">Go to My Courses</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-50 mb-2">Payment Failed!</h1>
            <p className="text-xl text-gray-300 mb-8">{error || 'Something went wrong. Please try again.'}</p>
          </div>
        )}
      </div>
  )
}

export default PaymentSuccessPage
