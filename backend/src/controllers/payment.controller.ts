import { Request, Response } from 'express'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const verifyPaymentController = async (req: Request, res: Response) => {
    const { session_id  } = req.query
    console.log("sessionId", session_id)
    
    const session = await stripe.checkout.sessions.retrieve(session_id as string)
    console.log("session", session)

    if(session.status === 'complete') {
      const userId = session.metadata?.userId
      const courseId = session.metadata?.courseId


      if(!userId || !courseId) {
        res.status(400).json({ success: false })
        return
      }

      const enrolled = await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId
        }
      })

      if(enrolled) {
        res.status(200).json({ success: true })
        return
      }

      const course = await prisma.course.findUnique({
        where: {
          id: courseId
        }
      })

      if(!course) {
        res.status(400).json({ success: false })
        return
      }

      const enroll = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          courseName: course.title,
          courseImageUrl: course.imageUrl,
          courseDescription: course.description
        }
      })

      res.status(200).json({ success: true })
      return
    } else {
      res.status(400).json({ success: false })
      return
    }
}