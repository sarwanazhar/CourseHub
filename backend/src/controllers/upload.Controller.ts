import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

const prisma = new PrismaClient();

interface VideoUploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  duration: number;

}

export const uploadFile = async (req: Request, res: Response) => {
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

      res.status(200).send({ public_id: result.public_id, secure_url: result.secure_url });
    } catch (error) {
      console.error('Cloudinary Error:', error);
      res.status(500).send('Failed to upload file to Cloudinary');
    }
  } else {
    res.status(400).send('No file uploaded or file type is incorrect');
  }
}; 

export const uploadVideo = async (req: Request, res: Response) => {
  const { title, courseId, userId } = req.body;

  // Check if the file size is greater than 100MB
  if(req.file?.size && req.file.size > 100000000) {
    res.status(400).json({ message: 'File size is too large please upload a file less than 100MB, if you want to compress your video please use the compressing feature instead then upload it' });
    return;
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('Cloudinary credentials are not set');
    res.status(500).json({ message: 'Cloudinary credentials are not set' });
    return;
  }

  if (!title || !courseId || !userId || !req.file) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      AND: {
        userId
      }
    }
  })

  if (!course) {
    res.status(404).json({ message: 'Course not found, or you are not authorized to upload videos to this course' });
    return;
  }

  try {
    console.log('Uploading video to Cloudinary...');
    const file = req.file;
    const buffer = Buffer.from(file.buffer);

    const result = await new Promise<VideoUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        resource_type: 'video',
        folder: 'coursehub/videos',
        chunk_size: 6000000,
      }, (error, result) => {
        if (error) reject(error);
        resolve(result as unknown as VideoUploadResult);
      });
      uploadStream.end(buffer);
    });

    const newVideo = await prisma.video.create({
      data: {
        title: title,
        userId: course.userId,
        courseId: courseId,
        videoUrl: result.secure_url,
        videoDuration: `${Math.floor(result.duration / 60)}:${Math.floor(result.duration % 60)}`,
        videoSize: (result.bytes / 1024 / 1024).toString(),
      }
    })

    console.log('Video uploaded successfully to Cloudinary');
    // Respond with the video URL and other details
    res.status(200).json({
      message: 'Video uploaded successfully',
      videoId: newVideo.id,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      size: result.bytes / 1024 / 1024,
      duration: `${Math.floor(result.duration / 60)}:${Math.floor(result.duration % 60)}`,
      newVideo: newVideo,
    });
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).send('Failed to upload video to Cloudinary');
  }
};


export const uploadVideoCompressing = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No video file uploaded' });
    return;
  }

  const { userId } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      compressedVideos: true,
    }
  });

  console.log(user);
  console.log(user?.compressedVideos);
  console.log("compressing video");

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (user.id !== userId) {
    res.status(403).json({ message: 'Unauthorized to upload videos' });
    return;
  }

  try {
    const tempFilePath = `/tmp/${Date.now()}_input.mp4`;
    fs.writeFileSync(tempFilePath, req.file.buffer);
    const outputFilePath = `${tempFilePath.split('.')[0]}_compressed.mp4`;

    // Compress the video using ffmpeg with adjusted parameters for memory efficiency
    ffmpeg(tempFilePath)
      .outputOptions([
        '-preset slower', // Slower preset for better compression but more time
        '-vcodec libx264',
        '-crf 28', // Higher CRF for more compression (lower quality)
        '-b:v 1000k', // Lower bitrate for even more compression
        '-filter:v scale=-2:480', // Lower resolution (480p) for memory savings
        '-max_alloc 400000000' // Set max memory allocation to 400 MB
      ])
      .save(outputFilePath)
      .on('end', async () => {
        console.log('Compression finished.');

        const buffer = fs.readFileSync(outputFilePath);

        // Upload the compressed video to Cloudinary
        const result = await new Promise<VideoUploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'video',
            folder: 'coursehub/videos',
            chunk_size: 6000000,
          }, (error, result) => {
            if (error) reject(error);
            resolve(result as unknown as VideoUploadResult);
          });
          uploadStream.end(buffer);
        });

        // Create video record in the database
        const newVideo = await prisma.compressedVideo.create({
          data: {
            videoUrl: result.secure_url,
            userId: userId,
            videoDuration: `${Math.floor(result.duration / 60)}:${Math.floor(result.duration % 60)}`,
            videoSize: ((result.bytes / 1024 / 1024).toFixed(2)) as string,
            date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
            originalSize: ((req.file?.size || 0 / 1024 / 1024).toFixed(2)) as string,
            compressionRate: ((1 - (result.bytes / (req.file?.size || 1))) * 100).toFixed(2) + '%',
          }
        });

        // Respond with the video URL and other details
        res.status(200).json({
          message: 'Video uploaded and compressed successfully',
          videoId: newVideo.id,
          videoUrl: result.secure_url,
          publicId: result.public_id,
          size: result.bytes / 1024 / 1024,
          duration: `${Math.floor(result.duration / 60)}:${Math.floor(result.duration % 60)}`,
          newVideo: newVideo,
        });

        // Delete the temporary files
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(outputFilePath);
      })
      .on('error', (err) => {
        console.error('Compression Error:', err);
        res.status(500).send('Failed to compress and upload video');
        // Attempt to clean up even in case of error
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(outputFilePath);
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to process video');
  }
};
