import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import PositionController from '@app/controllers/PositionController'
import PositionValidations from '@routes/validations/position'

const router = Router()

router.route('/').get(PositionController.getAllPositions)

router
  .route('/:id')
  .get(PositionController.getPosition)
  .put(isAuthenticated, isAdmin, validate(PositionValidations.updateRules), PositionController.updatePosition)
  .delete(isAuthenticated, isAdmin, PositionController.deletePosition)

router.post(
  '/create',
  isAuthenticated,
  isAdmin,
  validate(PositionValidations.createRules),
  PositionController.createPosition,
)

export default router
