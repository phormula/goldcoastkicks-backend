import { Router } from 'express'

import authRouter from '@routes/api/auth'
import userRouter from '@routes/api/user'
import adminRouter from '@routes/api/admin'
import superAdminRouter from '@routes/api/superAdmin'
import productRouter from '@routes/api/product'
import orderRouter from '@routes/api/order'
import brandRouter from '@routes/api/brand'
import colorwayRouter from '@routes/api/colorway'
import sizeRouter from '@routes/api/size'

import UserController from '@app/controllers/UserController'

import { isAdmin, isAuthenticated } from '@app/middleware'

const router = Router()

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/admin', adminRouter)
router.use('/super-admin', superAdminRouter)

router.use('/products', productRouter)
router.use('/orders', orderRouter)
router.use('/brands', brandRouter)
router.use('/colorways', colorwayRouter)
router.use('/sizes', sizeRouter)

router.get('/mail-templates', isAuthenticated, isAdmin, UserController.getMailTemplates)

export default router
