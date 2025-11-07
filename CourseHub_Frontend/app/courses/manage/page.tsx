import { ManageCoursesPage } from "@/components/course/manageCourse"
import { Metadata } from "next"
export const metadata: Metadata = {
    title: "CourseHub | Manage Courses",
};

const page = () => {
    return <ManageCoursesPage />
}

export default page