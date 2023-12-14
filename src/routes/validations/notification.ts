import { body } from 'express-validator'

class TypeValidations {
  createRules = [body('user_id').isNumeric().exists()]

  updateRules = [body('name').exists(), body('description').optional()]
}

export default new TypeValidations()
