import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import { adminRegisterRules } from '@routes/validations/auth'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.post(
  '/register',
  isAuthenticated,
  isAdmin,
  validate(adminRegisterRules),
  AuthController.register,
)

export default router
