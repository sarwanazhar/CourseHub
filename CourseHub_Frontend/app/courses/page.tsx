import CoursesComponent from "@/components/course/courseComponent"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "CourseHub | Courses",
};

const CoursesPage = () => {
  return <div className="w-screen min-h-screen flex items-center justify-center bg-black">
    <CoursesComponent />
  </div>
}

export default CoursesPage