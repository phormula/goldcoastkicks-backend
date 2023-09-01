import { body } from 'express-validator'

class ColorwayValidations {
  createRules = [body('key').exists(), body('value').exists(), body('table_name').optional()]

  updateRules = [body('key').optional(), body('value').optional(), body('table_name').optional()]
}

export default new ColorwayValidations()
