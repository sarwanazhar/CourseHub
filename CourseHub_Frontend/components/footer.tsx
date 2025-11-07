import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 CourseHub. All rights reserved by Sarwan Azhar.</p>
          </div>
          <nav className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-100">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-100">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-gray-100">Contact Us</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

