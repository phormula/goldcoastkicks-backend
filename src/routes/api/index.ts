import { Router } from 'express'

import authRouter from '@routes/api/auth'
import userRouter from '@routes/api/user'
import adminRouter from '@routes/api/admin'
import superAdminRouter from '@routes/api/superAdmin'
import productRouter from '@routes/api/product'
import orderRouter from '@routes/api/order'
import brandRouter from '@routes/api/brand'
import colorwayRouter from '@routes/api/colorway'
import shippingRouter from '@routes/api/shipping'
import sizeRouter from '@routes/api/size'
import courtRouter from '@routes/api/court'
import positionRouter from '@routes/api/position'
import typeRouter from '@routes/api/type'
import currencyRouter from '@routes/api/currency'
import configRouter from '@routes/api/config'

import UserController from '@app/controllers/UserController'

import { isAdmin, isAuthenticated } from '@app/middleware'

const router = Router()

router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/super-admin', superAdminRouter)
router.use('/users', userRouter)

router.use('/brands', brandRouter)
router.use('/colorways', colorwayRouter)
router.use('/configs', configRouter)
router.use('/currencies', currencyRouter)
router.use('/orders', orderRouter)
router.use('/shipping', shippingRouter)
router.use('/products', productRouter)
router.use('/sizes', sizeRouter)

router.use('/courts', courtRouter)
router.use('/positions', positionRouter)
router.use('/types', typeRouter)

router.get('/mail-templates', isAuthenticated, isAdmin, UserController.getMailTemplates)

export default router
