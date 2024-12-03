import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

export const createCourse = async (req: Request, res: Response) => {
  const {title, description, userId, price} = req.body;
  
  let publicId = '';
  let imageUrl = '';

  console.log(req.file, title, description, userId, price)
  if(!title || !description || !userId || !price || !req.file) {
    res.status(400).json({message: 'All fields are required'})
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if(!user) {
    res.status(404).json({message: 'User not found'})
    return;
  }


  if (req.file) {
    try {
      const file = req.file;
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
    }
  } else {
    res.status(400).send('No file uploaded or file type is incorrect');
  }

  const newCourse = await prisma.course.create({
    data: {
      title,
      description,
      imageUrl,
      userId,
      price: Number(price)
    }
  })

  res.status(201).json(newCourse)
}

export const getAllCourses = async (req: Request, res: Response) => {
  const coursesPublished = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED'
    }
  })

  const courses = coursesPublished

  res.status(200).json({ courses });
}

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {user_id} = req.query

  if (!id || !user_id) {
    res.status(400).json({ message: 'Course ID is required' });
    return;
  }
  console.log(user_id)

  const course = await prisma.course.findUnique({
    where: {
      id: id as string,
    }
  })

  const user = await prisma.user.findUnique({
    where: {
      id: user_id as string
    }
  })

  if(!course || !user) {
    res.status(404).json({message: 'Course or user not found'})
    return;
  }

  const enrolled = await prisma.enrollment.findFirst({
    where: {
      userId: user.id,
      courseId: course.id
    }
  })

  const isEnrolled = enrolled ? true : false


  try {
    const getcourse = await prisma.course.findUnique({
      where: {
        id: id as string,
      },
      include: {
        videos: true,
      },
    });

    if (!getcourse) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: getcourse.userId,
      },
    });

    const course = {
      ...getcourse,
      instructor: user?.name || 'Unknown',
      videoCount: getcourse.videos.length || 0,
      isEnrolled
    };

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const publishCourse = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {userId} = req.body;

  const course = await prisma.course.findUnique({
    where: {
      id,
      AND: {
        userId
      }
    }
  })

  if(!course) {
    res.status(404).json({message: 'Course not found'})
    return;
  }

  const updatedCourse = await prisma.course.update({
    where: {id},
    data: {status: 'PUBLISHED'}
  })

  res.status(200).json(updatedCourse)
  return;
}

export const inactiveCourse = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {userId} = req.body;

  const course = await prisma.course.findUnique({
    where: {
      id,
      AND: {
        userId
      }
    }
  })

  if(!course) {
    res.status(404).json({message: 'Course not found'})
    return;
  }

  const updatedCourse = await prisma.course.update({
    where: {id},
    data: {status: 'INACTIVE'}
  })

  res.status(200).json(updatedCourse)
  return;
}

export const deleteCourse = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {userId} = req.body;

  const course = await prisma.course.findUnique({
    where: {
      id,
      AND: {
        userId
      }
    }
  })

  if(!course) {
    res.status(404).json({message: 'Course not found'})
    return;
  }

  const deletedCourse = await prisma.course.delete({
    where: {id}
  })

  res.status(200).json(deletedCourse)
  return;
}

export const updateCourse = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {userId, title, description, price} = req.body;
  const file = req.file;

  if(!title || !description || !userId || !price || !file) {
    res.status(400).json({message: 'Title, description, userId, price, and file are required'})
    return;
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
    title,
    description,
    price: Number(price),
    imageUrl
  };

  const updatedCourse = await prisma.course.update({
    where: {
      id,
      AND: {
        userId
      }
    },
    data: updateData
  })

  res.status(200).json(updatedCourse)
  return;
}

export const updateCourseWithoutFile = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {userId, title, description, price} = req.body;

  if (!title || !description || !userId || !price) {
    res.status(400).json({message: 'Title, description, userId, and price are required'})
    return;
  }

  const updatedCourse = await prisma.course.update({
    where: {
      id,
      AND: {
        userId
      }
    },
    data: {title, description, price: Number(price)}
  })

  res.status(200).json(updatedCourse)
  return;
}