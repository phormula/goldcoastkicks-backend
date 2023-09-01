import { Router } from 'express'
import AuthController from '@app/controllers/AuthController'
import AuthValidations from '@routes/validations/auth'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'

const router = Router()

router.post('/login', validate(AuthValidations.loginRules), AuthController.login)
router.post('/resetpass', validate(AuthValidations.resetPasswordRequestRules), AuthController.resetPassRequest)

router.post('/register', validate(AuthValidations.customerRegisterRules), AuthController.register)

router
  .route('/me')
  .get(isAuthenticated, AuthController.getCurrentUser)
  .put(isAuthenticated, validate(AuthValidations.updateProfileRules), AuthController.updateCurrentUser)
  .delete(isAuthenticated, isAdmin, AuthController.deleteCurrentUser)

router.put(
  '/me/password',
  isAuthenticated,
  validate(AuthValidations.changePasswordRules),
  AuthController.updatePassword,
)

router.route('/roles').get(isAuthenticated, isAdmin, AuthController.getRoles)

export default router
