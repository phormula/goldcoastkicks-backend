import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import { adminRegisterRules } from '@routes/validations/auth'
import VendorController from '@app/controllers/VendorController'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.route('/all').get(VendorController.getAllVendors)

router.route('/:id').get(VendorController.getVendor)

router.post(
  '/register',
  isAuthenticated,
  isAdmin,
  validate(adminRegisterRules),
  AuthController.register,
)

export default router
