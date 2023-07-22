import { Router } from 'express'
import { join } from 'path'
import { validate, isPassResetToken } from '@app/middleware'
import AuthValidations from '@routes/validations/auth'
import AuthController from '@app/controllers/AuthController'

const router = Router()
console.log(AuthValidations.changePasswordPageRules)
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(join(__dirname, '..', '..', 'views', 'index.html'))
})
// router.get(
//   '/auth/resetpass',
//   validate(AuthValidations.changePasswordPageRules),
//   isPassResetToken,
//   (req, res) => {
//     res.sendFile(join(__dirname, '..', '..', 'views', 'reset.html'))
//   },
// )
// router.post(
//   '/auth/resetpass',
//   validate(AuthValidations.resetPasswordRules),
//   isPassResetToken,
//   AuthController.resetPassword,
// )

export default router
