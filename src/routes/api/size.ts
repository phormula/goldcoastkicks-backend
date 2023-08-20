import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import SizeController from '@app/controllers/SizeController'
import SizeValidations from '@routes/validations/size'

const router = Router()

router.route('/').get(SizeController.getAllSizes)

router
  .route('/:id')
  .get(SizeController.getSize)
  .put(isAuthenticated, isAdmin, validate(SizeValidations.updateRules), SizeController.updateSize)
  .delete(isAuthenticated, isAdmin, SizeController.deleteSize)

router.post('/create', isAuthenticated, isAdmin, validate(SizeValidations.createRules), SizeController.createSize)

export default router
