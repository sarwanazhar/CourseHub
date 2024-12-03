import express from 'express';
import multer from 'multer';
import { uploadFile, uploadVideo, uploadVideoCompressing } from '../controllers/upload.Controller';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 200 * 1024 * 1024 } });

router.post('/image', upload.single('file'), uploadFile);

router.post('/video', upload.single('file'), uploadVideo);

router.post('/video-compressing', upload.single('file'), uploadVideoCompressing);

export default router; 