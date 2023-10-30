import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import OrderController from '@app/controllers/OrderController'
import OrderValidations from '@app/routes/validations/order'

const router = Router()

router.route('/').get(isAuthenticated, OrderController.getAllOrders)

router.route('/:id').get(isAuthenticated, OrderController.getOrder)

router.post('/create', isAuthenticated, validate(OrderValidations.createRules), OrderController.createOrder)

export default router
