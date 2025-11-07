import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 justify-center items-center px-4">
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-50 mb-2">Payment Cancelled</h1>
        <p className="text-xl text-gray-300 mb-8">Your payment was not processed. If you encountered any issues, please try again.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

