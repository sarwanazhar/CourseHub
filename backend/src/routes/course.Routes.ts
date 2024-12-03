import express from 'express';
import { createCourse, deleteCourse, getAllCourses, getCourseById, inactiveCourse, publishCourse, updateCourse, updateCourseWithoutFile } from '../controllers/course.Controller';
import multer from 'multer';
import { getCoursesByUserId } from '../controllers/user.Controller';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/create', upload.single('file'), createCourse)

router.get('/get-all', getAllCourses)

router.get('/:id', getCourseById)

router.get('/user/:userId', getCoursesByUserId)

router.post('/publish/:id', publishCourse)

router.post('/inactive/:id', inactiveCourse)

router.post('/delete/:id', deleteCourse)

router.post('/update/:id', upload.single('file'), updateCourse)

router.post('/update-without-file/:id', updateCourseWithoutFile)

export default router;