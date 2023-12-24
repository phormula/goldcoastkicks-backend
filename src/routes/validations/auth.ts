import { body, query } from 'express-validator'

class AuthValidations {
  commonloginRules = [
    body('is_mobile').default(0).optional(),
    body('device_type').exists(),
    body('device_token').exists(),
    body('device_token_type').exists(),
  ]
  loginRules = [body('email').isEmail().exists(), body('password').exists(), ...this.commonloginRules]
  webLoginRules = [
    body('email').isEmail().exists(),
    body('password').exists(),
    body('_csrf').exists(),
    ...this.commonloginRules,
  ]
  oAuthRules = [body('id_token').exists(), ...this.commonloginRules]

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
