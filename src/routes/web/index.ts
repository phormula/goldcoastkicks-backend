import 'dotenv/config'
import path from 'path'
import { Router } from 'express'
import { validate, isPassResetToken } from '@app/middleware'
import AuthValidations from '@app/routes/validations/auth'
import AuthController from '@app/controllers/AuthController'

const router = Router()

if (process.env.NODE_ENV !== 'production') {
  router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'index.html'))
  })
}
router.get('/auth/resetpass', validate(AuthValidations.changePasswordPageRules), isPassResetToken, (_req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'reset.html'))
})
router.post(
  '/auth/resetpass',
  validate(AuthValidations.resetPasswordRules),
  isPassResetToken,
  AuthController.resetPassword,
)

export default router
