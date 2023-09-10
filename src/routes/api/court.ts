import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import CourtController from '@app/controllers/CourtController'
import CourtValidations from '@routes/validations/court'

const router = Router()

router.route('/').get(CourtController.getAllCourts)

router
  .route('/:id')
  .get(CourtController.getCourt)
  .put(isAuthenticated, isAdmin, validate(CourtValidations.updateRules), CourtController.updateCourt)
  .delete(isAuthenticated, isAdmin, CourtController.deleteCourt)

router.post('/create', isAuthenticated, isAdmin, validate(CourtValidations.createRules), CourtController.createCourt)

export default router
