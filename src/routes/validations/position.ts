import { body } from 'express-validator'

class PositionValidations {
  createRules = [body('name').exists(), body('description').optional()]

  updateRules = [body('name').exists(), body('description').optional()]
}

export default new PositionValidations()
