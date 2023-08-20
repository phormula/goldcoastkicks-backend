import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import AuthValidations from '@routes/validations/auth'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.post(
  '/register',
  isAuthenticated,
  isAdmin,
  validate(AuthValidations.adminRegisterRules),
  AuthController.register,
)

export default router
