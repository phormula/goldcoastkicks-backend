import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import AuthValidations from '@routes/validations/auth'
import VendorController from '@app/controllers/VendorController'
import { isSuperAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.route('/all').get(VendorController.getAllVendors)

router.route('/:id').get(VendorController.getVendor)

router.post(
  '/register',
  isAuthenticated,
  isSuperAdmin,
  validate(AuthValidations.superAdminRegisterRules),
  AuthController.register,
)

export default router
