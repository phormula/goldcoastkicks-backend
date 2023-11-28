import { Request, Response, NextFunction } from 'express'
import { isAdmin } from '@app/helpers'
import Order from '@model/Order'
import OrderStatus from '@model/OrderStatus'
import User from '@model/User'
import MailService from '@app/services/Mail.service'
import OrderItem from '@model/OrderItem'

class OrderController {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as User
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 15
      const offset = (page - 1) * limit

      let orderQuery = Order.query()
        .select(
          'orders.*',
          'status.key as status_key',
          'status.value as status_value',
          'status.color as status_color',
          'user.id as user_id',
          'user.email as user_email',
          'user.first_name as user_first_name',
          'user.last_name as user_last_name',
          'currency.name as currency_name',
          'currency.code as currency_code',
          'currency.symbol as currency_symbol',
          'shipping.name as shipping_name',
          'shipping.duration as shipping_duration',
          Order.relatedQuery('detail').select(Order.raw('SUM(price * quantity)')).as('total_price'),
        )
        .leftJoinRelated('status')
        .leftJoinRelated('user')
        .leftJoinRelated('detail')
        .leftJoinRelated('shipping')
        .leftJoinRelated('currency')
        .groupBy('orders.id')
        .limit(limit)
        .offset(offset)

      let countQuery = Order.query()

      if (!isAdmin(user)) {
        orderQuery = orderQuery.where('user_id', Number(user.id))
        countQuery = countQuery.where('user_id', Number(user.id))
      }

      const orders = await orderQuery
      const totalOrders = (await countQuery.count('id').first()) as { [key: string]: any }

      res.send({
        data: orders,
        current_page: page,
        per_page: limit,
        total: totalOrders['count(`id`)'],
        last_page: Math.ceil(totalOrders['count(`id`)'] / limit),
      })
    } catch (err) {
      return next(err)
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await Order.query()
        .findById(req.params.id)
        .withGraphFetched('[detail.product(customerSelect), status, user(defaultSelects), shipping, currency]')

      const user = req.user as User

      if (order && (isAdmin(user) || order.user.id === user.id)) {
        return res.send({ data: { ...order } })
      }
      return res.status(404).send({ status: 'error', message: 'Order not found' })
    } catch (err) {
      return next(err)
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { line_orders, note, user, shipping_id, shipping_amount, currency_id } = req.body

      const userOrdered = user || (req.user as User).id
      const orderStatus = await OrderStatus.query().findOne({ key: 'placed' })
      const order = await Order.query().upsertGraph(
        {
          note,
          shipping_amount,
          detail: line_orders,
          status: [orderStatus],
          user: { id: userOrdered },
          shipping: { id: Number(shipping_id) },
          currency: { id: Number(currency_id) },
        },
        { relate: true },
      )
      res.status(201).json({ data: { order } })

      return order
    } catch (err) {
      next(err)
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id
      const { line_orders, note, status, user_id, shipping_id, shipping_amount } = req.body
      const updateOrder = await Order.query().updateAndFetchById(orderId, {
        note,
        user_id,
        order_status_id: status,
        shipping_amount,
        shipping_id: Number(shipping_id),
      })
      let updatedItems = []
      for (let i = 0; i < line_orders.length; i++) {
        const { id, ...item } = line_orders[i]
        const updatedItem = await OrderItem.query().updateAndFetchById(id, item).where({ order_id: orderId })
        updatedItems.push(updatedItem)
      }
      updateOrder.detail = updatedItems

      // MailService.sendMail({to:})
      return res.status(200).json({ data: { ...updateOrder } })
    } catch (error) {
      return next(error)
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id
      const order = await Order.query().findById(orderId)

      if (order) {
        await order.$relatedQuery('detail').unrelate()
        await order.$query().delete()

        return res.status(200).json({ data: { status: 'success', message: 'Order deleted successfully' } })
      }

      return res.status(500).json({ error: 'Error deleting order!' })
    } catch (err) {
      next(err)
    }
  }

  async orderStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus = await OrderStatus.query()

      return res.send({ data: orderStatus })
    } catch (err) {
      return next(err)
    }
  }

  async getOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus = await OrderStatus.query().findById(req.params.id)

      return res.send({ data: { ...orderStatus } })
    } catch (err) {
      return next(err)
    }
  }

  async createOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, color, description } = req.body
      const orderStatus = await OrderStatus.query().insert({ key, value, color, description })

      return res.status(200).json({ data: orderStatus })
    } catch (err) {
      return next(err)
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, color, description } = req.body
      const orderStatus = await OrderStatus.query()
        .update({ key, value, color, description })
        .where({ id: req.params.id })

      return res.status(200).json({ data: orderStatus })
    } catch (err) {
      return next(err)
    }
  }

  async deleteOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      await OrderStatus.query().findById(req.params.id).delete()

      return res.status(200).json({ data: { status: 'success', message: 'Order status deleted successfully' } })
    } catch (error) {
      return next(error)
    }
  }
}

export default new OrderController()
