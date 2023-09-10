import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import TypeController from '@app/controllers/TypeController'
import TypeValidations from '@routes/validations/type'

const router = Router()

router.route('/').get(TypeController.getAllTypes)

router
  .route('/:id')
  .get(TypeController.getType)
  .put(isAuthenticated, isAdmin, validate(TypeValidations.updateRules), TypeController.updateType)
  .delete(isAuthenticated, isAdmin, TypeController.deleteType)

router.post('/create', isAuthenticated, isAdmin, validate(TypeValidations.createRules), TypeController.createType)

export default router
