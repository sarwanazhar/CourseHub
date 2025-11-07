import express from 'express';
import dotenv from 'dotenv'
import userRoute from './routes/user.routes'
import uploadRoute from './routes/upload.Routes'
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary';
import courseRoute from './routes/course.Routes';
import bodyParser from 'body-parser';
import enrolledRoute from './routes/enrolled.routes'
import paymentRoute from './routes/payment.routes'

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const app = express();
const PORT = 8000;
app.use(cors({
  origin: "*"
}))

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));

// Routes
app.use('/user', userRoute)

app.use('/upload', uploadRoute)

app.use('/course', courseRoute)

app.get('/', (req,res) => {
  res.send('This is the backend server of CourseHub')
})

app.use('/enrolled', enrolledRoute)

app.use('/verify-payment', paymentRoute)

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`)
})
