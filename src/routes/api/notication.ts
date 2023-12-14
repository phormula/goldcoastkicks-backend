import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import TypeController from '@app/controllers/TypeController'
import TypeValidations from '@routes/validations/type'
import NotificationValidations from '@routes/validations/notification'
import NotificationController from '@app/controllers/NotificationController'

const router = Router()

router.route('/').get(isAuthenticated, isAdmin, NotificationController.getAllNotifications)

router
  .route('/:id')
  .get(TypeController.getType)
  .put(isAuthenticated, isAdmin, validate(TypeValidations.updateRules), TypeController.updateType)
  .delete(isAuthenticated, isAdmin, TypeController.deleteType)

router.post(
  '/sendpush',
  isAuthenticated,
  isAdmin,
  validate(NotificationValidations.createRules),
  NotificationController.sendPush,
)
router.post('/create', isAuthenticated, isAdmin, validate(TypeValidations.createRules), TypeController.createType)

export default router
