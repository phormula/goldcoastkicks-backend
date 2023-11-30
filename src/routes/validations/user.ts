import { body, query } from 'express-validator'

class UserValidations {
  getAddressRules = [query('user_id').exists()]
  commonAddressRules = [
    body('user_id').exists(),
    body('address').exists(),
    body('house_no').exists(),
    body('town').exists(),
    body('city').exists(),
    body('region').exists(),
    body('country').optional(),
    body('is_default').exists(),
  ]
  createAddressRules = [...this.commonAddressRules]

  updateAddressRules = [...this.commonAddressRules]

  updateUserRules = [
    body('email').exists(),
    body('first_name').exists(),
    body('last_name').exists(),
    body('roles').exists(),
    body('is_disabled').optional(),
  ]
}

export default new UserValidations()
