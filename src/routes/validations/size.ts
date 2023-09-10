import { body } from 'express-validator'

class SizeValidations {
  createRules = [body('size_name').exists(), body('origin_country').optional()]

  updateRules = [body('name').exists(), body('description').optional()]
}

export default new SizeValidations()
