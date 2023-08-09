import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import ColorwayController from '@app/controllers/ColorwayController'
import ColorwayValidations from '@routes/validations/colorway'

const router = Router()

router.route('/').get(ColorwayController.getAllColorways)

router
  .route('/:id')
  .get(ColorwayController.getColorway)
  .put(isAuthenticated, isAdmin, validate(ColorwayValidations.updateRules), ColorwayController.updateColorway)
  .delete(isAuthenticated, isAdmin, ColorwayController.deleteColorway)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  validate(ColorwayValidations.createRules),
  ColorwayController.createColorway,
)

export default router
