import express from 'express'
import { enrollInCourse, getCourse, getEnrolledCourses, getVideo } from '../controllers/enrolled.controller'


const router = express.Router()

router.get('/:userId', (req, res) => {
    getEnrolledCourses(req, res)
})

router.post('/', (req, res) => {
    enrollInCourse(req, res)
})

router.get('/course/:courseId', (req, res) => {
    getCourse(req, res)
})

router.get('/:courseId/videos/:videoId', (req, res) => {
    getVideo(req, res)
})


export default router