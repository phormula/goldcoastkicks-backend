import { body } from 'express-validator'

class ShippingValidations {
  createRules = [
    body('name').exists(),
    body('amount').isDecimal().exists(),
    body('duration').exists(),
    body('currency').exists(),
  ]

  updateRules = [
    body('name').exists(),
    body('amount').isDecimal().exists(),
    body('duration').exists(),
    body('currency').exists(),
  ]
}

export default new ShippingValidations()
