import { HomeComponent } from "@/components/home/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CourseHub | Home",
};

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-black to-black w-full min-h-screen overflow-x-hidden mt-14 lg:mt-0">
      <HomeComponent />
    </div>
  );
}
