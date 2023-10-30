import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import ShippingController from '@app/controllers/ShippingController'
import ShippingValidations from '@routes/validations/shipping'

const router = Router()

router.route('/').get(ShippingController.getAllShippings)

router
  .route('/:id')
  .get(ShippingController.getShipping)
  .put(isAuthenticated, isAdmin, validate(ShippingValidations.updateRules), ShippingController.updateShipping)
  .delete(isAuthenticated, isAdmin, ShippingController.deleteShipping)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  validate(ShippingValidations.createRules),
  ShippingController.createShipping,
)

export default router
