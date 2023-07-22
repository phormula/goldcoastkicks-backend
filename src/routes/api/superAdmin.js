import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import AuthValidations from '@routes/validations/auth'
import { getAllVendors, getVendor } from '@app/controllers/VendorController'
import { isSuperAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.route('/all').get(getAllVendors)

router.route('/:id').get(getVendor)

router.post(
  '/register',
  isAuthenticated,
  isSuperAdmin,
  validate(AuthValidations.superAdminRegisterRules),
  AuthController.register,
)

export default router
