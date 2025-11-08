import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { deleteImage } from "../libs/deleteimage";
import { v2 as cloudinary } from 'cloudinary';

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

export const getCoursesByUserId = async (req: Request, res: Response) => {
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

export const updateUserDetails = async (req: Request, res: Response) => {
  const { id, name } = req.body;
  const file = req.file;

  if (!id || !name || !file) {
    res.status(400).json({ message: 'All Fields are required' })
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })

  if (!user) {
    res.status(400).json({ message: 'no user exist with that id' })
    return;
  }

  if (user.imagePublicId) {
    deleteImage(user.imagePublicId)
  }

  let publicId = '';
  let imageUrl = '';

  try {
    const buffer = Buffer.from(file.buffer);
    const result = await new Promise<{ secure_url: string, public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: 'coursehub/images',
      }, (error, result) => {
        if (error) reject(error);
        resolve(result as { secure_url: string, public_id: string });
      });
      uploadStream.end(buffer);
    });

    imageUrl = result.secure_url;
    publicId = result.public_id;
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).send('Failed to upload file to Cloudinary');
    return;
  }

  const updateData = {
    imageUrl,
    imagePublicId: publicId,
    name
  };

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: updateData
  })

  res.status(200).json(updatedUser)
  return;

}

export const updateUserDetailsWithoutFile = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  if (!id || !name) {
    res.status(400).json({ message: 'All Fields are required' })
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })

  if (!user) {
    res.status(400).json({ message: 'no user exist with that id' })
    return;
  }

  const updateData = {
    name
  };

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: updateData
  })

  res.status(200).json(updatedUser)
  return;
}