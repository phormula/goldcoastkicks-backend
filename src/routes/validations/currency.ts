import { body } from 'express-validator'

class CurrencyValidations {
  createRules = [body('code').exists(), body('name').exists(), body('symbol').optional()]

  updateRules = [body('code').optional(), body('name').optional(), body('symbol').optional()]
  convertRules = [body('from').exists(), body('to').exists()]
}

export default new CurrencyValidations()
