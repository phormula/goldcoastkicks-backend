import { body } from 'express-validator'

class CourtValidations {
  createRules = [body('name').exists(), body('description').optional()]

  updateRules = [body('name').exists(), body('description').optional()]
}

export default new CourtValidations()
