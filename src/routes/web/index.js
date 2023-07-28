import { Router } from 'express'
import path from 'path'
import { validate, isPassResetToken } from '../../middleware'
import AuthValidations from '../validations/auth'
import AuthController from '../../controllers/AuthController'

const __dirname = path.dirname(__filename)

const router = Router()

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'))
})
router.get(
  '/auth/resetpass',
  validate(AuthValidations.changePasswordPageRules),
  isPassResetToken,
  (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'reset.html'))
  },
)
router.post(
  '/auth/resetpass',
  validate(AuthValidations.resetPasswordRules),
  isPassResetToken,
  AuthController.resetPassword,
)

export default router
