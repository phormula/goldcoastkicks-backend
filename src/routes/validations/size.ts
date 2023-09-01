import { body } from 'express-validator'

class BrandValidations {
  createRules = [body('size_name').exists(), body('origin_country').optional()]

  updateRules = [body('name').exists(), body('description').optional()]
}

export default new BrandValidations()
