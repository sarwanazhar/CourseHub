import express from 'express'
import { enrollInCourse, getCourse, getEnrolledCourses } from '../controllers/enrolled.controller'


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


export default router