import { body } from 'express-validator'

class OrderValidations {
  createRules = [
    body('line_orders')
      .exists()
      .withMessage('line_orders is required')
      .isArray()
      .withMessage('line_orders is not array')
      .custom((value) => {
        value.forEach((v: any) => {
          if (!v.product_id) {
            throw new Error('line order product_id is required')
          }
          if (!v.price) {
            throw new Error('line order price is required')
          }
          if (!v.size) {
            throw new Error('line order size is required')
          }
          if (!v.colour) {
            throw new Error('line order colour is required')
          }
          if (!v.quantity) {
            throw new Error('line order quantity is required')
          }
          if (!v.image) {
            throw new Error('line order image is required')
          }
          if (!v.colorway_id) {
            throw new Error('line order colorway_id is required')
          }
        })
        return true
      }),
    body('note').optional(),
    body('user').optional(),
    body('shipping_id').exists(),
    body('currency_id').exists(),
    body('shipping_amount').exists(),
  ]

  updateRules = [
    body('line_orders')
      .exists()
      .withMessage('line_orders is required')
      .isArray()
      .withMessage('line_orders is not array')
      .custom((value) => {
        value.forEach((v: any) => {
          if (!v.id) {
            throw new Error('line order id is required')
          }
          if (!v.product_id) {
            throw new Error('line order product_id is required')
          }
          if (!v.price) {
            throw new Error('line order price is required')
          }
          if (!v.size) {
            throw new Error('line order size is required')
          }
          if (!v.colour) {
            throw new Error('line order colour is required')
          }
          if (!v.quantity) {
            throw new Error('line order quantity is required')
          }
          if (!v.image) {
            throw new Error('line order image is required')
          }
          if (!v.colorway_id) {
            throw new Error('line order colorway_id is required')
          }
        })
        return true
      }),
    body('note').exists(),
    body('shipping_id').exists(),
    body('shipping_amount').exists(),
    body('status_id').exists(),
  ]

  statusRules = [body('key').exists(), body('value').exists(), body('color').exists(), body('description').optional()]
}

export default new OrderValidations()
