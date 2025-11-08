import React from 'react'
import { Metadata } from "next"
import DashboardComponent from '@/components/dashboard/dashboard';

export const metadata: Metadata = {
  title: "CourseHub | Dashboard",
};


function Dashboard() {
  return (
    <div className='w-screen min-h-screen mt-5 bg-black text-white pt-10'>
        <DashboardComponent />
    </div>
  )
}

export default Dashboard