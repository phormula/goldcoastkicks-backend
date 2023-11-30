import { Router } from 'express'
import { checkAdminOrOwner, isAdmin, isAuthenticated, validate } from '@app/middleware'
import OrderController from '@app/controllers/OrderController'
import OrderValidations from '@app/routes/validations/order'
import Order from '@model/Order'

const router = Router()

router.route('/').get(isAuthenticated, OrderController.getAllOrders)

router.route('/statuses').get(isAuthenticated, isAdmin, OrderController.orderStatus)
router
  .route('/statuses/:id')
  .get(isAuthenticated, isAdmin, OrderController.getOrderStatus)
  .put(isAuthenticated, isAdmin, validate(OrderValidations.statusRules), OrderController.updateOrderStatus)
  .delete(isAuthenticated, isAdmin, OrderController.deleteOrderStatus)
router
  .route('/statuses/create')
  .post(isAuthenticated, isAdmin, validate(OrderValidations.statusRules), OrderController.createOrderStatus)

router
  .route('/:id')
  .get(isAuthenticated, checkAdminOrOwner(Order, 'user_id'), OrderController.getOrder)
  .put(
    isAuthenticated,
    checkAdminOrOwner(Order, 'user_id'),
    validate(OrderValidations.updateRules),
    OrderController.updateOrder,
  )
  .delete(isAuthenticated, isAdmin, OrderController.deleteOrder)

router.post('/create', isAuthenticated, validate(OrderValidations.createRules), OrderController.createOrder)

export default router
