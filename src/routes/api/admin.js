import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import { adminRegisterRules } from '@routes/validations/auth'
import { getAllVendors, getVendor } from '@app/controllers/VendorController'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.route('/all').get(getAllVendors)

router.route('/:id').get(getVendor)

router.post(
  '/register',
  isAuthenticated,
  isAdmin,
  validate(adminRegisterRules),
  AuthController.register,
)

export default router
