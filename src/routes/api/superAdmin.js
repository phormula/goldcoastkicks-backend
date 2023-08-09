import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import AuthValidations from '@routes/validations/auth'
import { isSuperAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.post(
  '/register',
  isAuthenticated,
  isSuperAdmin,
  validate(AuthValidations.superAdminRegisterRules),
  AuthController.register,
)

export default router
