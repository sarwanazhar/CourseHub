import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

const SidebarContent = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

    return (  
        <>
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold text-center mt-4 px-4 text-white">
            Navigation
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-4 justify-between h-full">
          <div>
          {/* home button */}
          <Button variant='ghost' className="w-full justify-start gap-2 text-xl" onClick={() => {
            router.push('/')
            // close the sheet
            onClose()

          }}>
            Home
          </Button>
          {/* courses button */}
          <Button variant='ghost' className="w-full justify-start gap-2 text-xl" onClick={() => {
            router.push('/courses')
            onClose()
          }}>
            Courses
          </Button>
          {/* Manage Courses button */}
          <Button variant='ghost' className="w-full justify-start gap-2 text-xl" onClick={() => {
            router.push('/courses/manage')
            onClose()
          }}>
            Manage Courses
          </Button>
          {/* my courses button */}
          <Button variant='ghost' className="w-full justify-start gap-2 text-xl" onClick={() => {
            router.push('/courses/enrolled')
            onClose()
          }}>
            My Courses
          </Button>
          {/* compressed videos button */}
          <Button variant='ghost' className="w-full justify-start gap-2 text-xl" onClick={() => {
            router.push('/compressed-videos')
            onClose()
          }}>
            Compressed Videos
          </Button>
          </div>
          <div>
            <Button variant='ghost' className="w-full justify-start gap-2 text-xl mb-4" onClick={() => {
              router.push('/dashboard')
              onClose()
            }}>
              <LayoutDashboard className="mr-2" size={20}/>
              Dashboard
            </Button>
          </div>
        </div>
        </>
    )
}

export default SidebarContent;