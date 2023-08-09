import { Router } from 'express'
import { isAdmin, isAuthenticated, validate } from '@app/middleware'
import OrderController from '@app/controllers/OrderController'
import OrderValidations from '@app/routes/validations/order'

const router = Router()

router.route('/').get(isAuthenticated, isAdmin, OrderController.getAllOrders)

router.route('/:id').get(isAuthenticated, isAdmin, OrderController.getOrder)

router.post('/create', isAuthenticated, isAdmin, validate(OrderValidations.createRules), OrderController.createOrder)

export default router
