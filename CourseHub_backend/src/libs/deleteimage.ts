import { v2 as cloudinary } from 'cloudinary';

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted successfully:', result);
  } catch (error) {
    console.log(error)
  }
};
