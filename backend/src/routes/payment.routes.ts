import express from 'express'
import { verifyPaymentController } from '../controllers/payment.controller'

const router = express.Router()

router.post('/', verifyPaymentController)

export default router