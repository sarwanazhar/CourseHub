import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const prisma = new PrismaClient()

export const getEnrolledCourses = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  console.log(userId)

  try {
    const enrolledCourses = await prisma.enrollment.findMany({
      where: {
        userId: userId
      },
      include: {
        course: true,
      }
    })
    const courses = {
      enrolledCourses,
    }

    res.status(200).json(courses)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const enrollInCourse = async (req: Request, res: Response) => {
  const { userId, courseId } = req.body

  if (!userId || !courseId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    return res.status(404).json({ message: 'Course not found' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: course.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        courseId,
        userId,
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: {
      error: error,
      message: 'Internal server error'
    } })
  }

}

export const getCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params

  if (!courseId) {
    res.status(400).json({ message: 'Missing required fields' })
    return null
  }

  console.log(courseId)

  const course = await prisma.course.findUnique({
    where: { 
      id: courseId as string,
     }
  })

  if (!course) {
    res.status(404).json({ message: 'Course not found' })
    return null
  }

  const videos = await prisma.video.findMany({
    where: {
      courseId: courseId
    }
  })


  const courseData = {
    course,
    modules: videos
  }

  res.status(200).json(courseData)
}