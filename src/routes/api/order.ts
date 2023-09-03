import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import OrderController from '@app/controllers/OrderController'
import OrderValidations from '@app/routes/validations/order'

const router = Router()

// router.route('current-user/:id').get(isAuthenticated, OrderController.getUserOrder)
router.route('/current-user').get(isAuthenticated, OrderController.getUserOrders)

router.route('/').get(isAuthenticated, isAdmin, OrderController.getAllOrders)

router.route('/:id').get(isAuthenticated, OrderController.getOrder)

router.post('/create', isAuthenticated, isAdmin, validate(OrderValidations.createRules), OrderController.createOrder)

export default router
