import { body, query } from 'express-validator'

class AuthValidations {
  loginRules = [body('email').isEmail().exists(), body('password').exists(), body('is_mobile').optional()]
  oAuthRules = [body('id_token').exists(), body('is_mobile').optional()]

  resetPasswordRequestRules = [body('email').isEmail().exists()]

  changePasswordPageRules = [query('token').exists()]

  resetPasswordRules = [body('newPassword').exists(), body('confirmPassword').exists(), body('token').exists()]

  #commonRegisterRules = [
    body('first_name').exists(),
    body('last_name').exists(),
    body('email').isEmail().exists(),
    body('password').isLength({ min: 6 }).exists(),
  ]

  customerRegisterRules = [
    ...this.#commonRegisterRules,
    body('role').isIn(['customer']).optional(),
    body('is_mobile').optional(),
  ]

  adminRegisterRules = [...this.#commonRegisterRules, body('role').isIn(['admin', 'customer']).exists()]

  superAdminRegisterRules = [
    ...this.#commonRegisterRules,
    body('role').isIn(['super-admin', 'admin', 'customer']).exists(),
  ]

  updateProfileRules = [body('name').optional(), body('email').isEmail().optional()]

  changePasswordRules = [body('current').exists(), body('password').isLength({ min: 6 }).exists()]
}

export default new AuthValidations()
