import { Router } from 'express'
import authRouter from '@app/routes/api/auth'
import userRouter from '@app/routes/api/user'
import adminRouter from '@app/routes/api/admin'
import superAdminRouter from '@app/routes/api/superAdmin'
import productRouter from '@app/routes/api/product'
import orderRouter from '@app/routes/api/order'
import brandRouter from '@app/routes/api/brand'
import colorwayRouter from '@app/routes/api/colorway'
import sizeRouter from '@app/routes/api/size'
import UserController from '@app/controllers/UserController'
import UploadController from '@app/controllers/UploadController'
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

router.post('/upload', UploadController.upload)

export default router
