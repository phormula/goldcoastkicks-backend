import { Router } from 'express'
import authRouter from '@app/routes/api/auth'
import userRouter from '@app/routes/api/user'
import vendorRouter from '@app/routes/api/vendor'
import adminRouter from '@app/routes/api/admin'
import superAdminRouter from '@app/routes/api/superAdmin'
import { getMailTemplates } from '@app/controllers/UserController'
import { isAdmin, isAuthenticated } from '@app/middleware'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/vendor', vendorRouter)
router.use('/admin', adminRouter)
router.use('/super-admin', superAdminRouter)

router.get('/mail-templates', isAuthenticated, isAdmin, getMailTemplates)

export default router
