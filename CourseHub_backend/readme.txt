
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "axios": "^1.7.7",
    "body-parser": "^1.20.3",
    "cloudinary": "^2.5.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "fluent-ffmpeg": "^2.1.3",
    "googleapis": "^144.0.0",
    "multer": "^1.4.5-lts.1",
    "prisma": "^5.22.0",
    "stripe": "^17.4.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/fluent-ffmpeg": "^2.1.27",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.9.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  }

user routes: 
get /user/ - returns all the users
get /user/:id - returns the user
post /user/register - creates user

course routes:
post /course/create (file included 1) - creates course the image is used as course image
get /course/get-all - returns all PUBLISHED courses only

router.get('/:id', getCourseById) - obvious

router.get('/user/:userId', getCoursesByUserId) - obvious

router.post('/publish/:id', publishCourse) -obvious

router.post('/inactive/:id', inactiveCourse) -obvious

router.post('/delete/:id', deleteCourse) -obvious

router.post('/update/:id', upload.single('file'), updateCourse) -obvious

router.post('/update-without-file/:id', updateCourseWithoutFile) -obvious

enrolled routes: 
get /enrolled/:userId - returns the the courses that the user is enrolled to has purchased
post /enrolled/ (req:userId,courseId) - {creates payment with stripe and then redirects to success or failure page, if succeded verifies payment with backend on post /verify-payment then enrolls the user in the course}
router.get('/course/:courseId', (req, res) => { - obvious
    getCourse(req, res)
})

router.get('/:courseId/videos/:videoId', (req, res) => { - obvious
    getVideo(req, res)
})

upload routes: (mainly used for compressing and storing videos on uploadinary)
router.post('upload/image', upload.single('file'), uploadFile);

router.post('upload/video', upload.single('file'), uploadVideo);

router.post('upload/video-compressing', upload.single('file'), uploadVideoCompressing);