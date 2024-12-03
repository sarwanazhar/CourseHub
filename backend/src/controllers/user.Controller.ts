import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { name, email, imageUrl } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await prisma.user.findFirst({
    where: { email }
  })

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await prisma.user.create({
    data: { name, email, imageUrl }
  })

  return res.status(201).json(newUser);
}

export const getUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  return res.status(200).json(user);
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id as string,
    },
    include: {
      compressedVideos: true,
    } 
  });
  return res.status(200).json(user);
}

export const getCoursesByUserId = async (req:Request, res: Response) =>{
  const { userId } = req.params;
  const courses = await prisma.course.findMany({
    where: {
      userId: userId as string,
    },
    include: {
      enrollments: true,
      videos: true,
    }
  })


  res.status(200).json({ courses, videos: courses.flatMap(course => course.videos) });
}