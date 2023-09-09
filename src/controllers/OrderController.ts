import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import Order from '@model/Order'
import OrderStatus from '@model/OrderStatus'
import Role from '@model/Role'
import User from '@app/model/User'

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
          Order.relatedQuery('detail').sum('price').as('total_price'),
        )
        .leftJoinRelated('status')
        .leftJoinRelated('user')
        .leftJoinRelated('detail')
        .groupBy('orders.id')
        .limit(limit)
        .offset(offset)

      let countQuery = Order.query()

      const isAdmin = user.roles.map((role: Role) => role.key).some((r: string) => r === 'super-admin' || r === 'admin')

      if (!isAdmin) {
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
        .withGraphFetched('[detail, status,user(defaultSelects)]')

      const user = req.user as User

      const isAdmin = user.roles.map((role: Role) => role.key).some((r: string) => r === 'super-admin' || r === 'admin')

      if (order && (isAdmin || order.user.id === user.id)) {
        return res.send({ data: { ...order } })
      }
      return res.status(404).send({ status: 'error', message: 'Order not found' })
    } catch (err) {
      return next(err)
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { line_orders, note, user } = req.body

      const userOrdered = user || (req.user as User).id
      const orderStatus = await OrderStatus.query().findOne({ key: 'placed' })
      const order = await Order.query().upsertGraph(
        [
          {
            note,
            detail: line_orders,
            status: [orderStatus],
            user: { id: userOrdered },
          },
        ],
        { relate: ['detail', 'status', 'user'] },
      )
      res.status(201).json({ data: { order } })

      return order
    } catch (err) {
      next(err)
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    // Update a product in the database based on the data from the request body
    const orderId = req.params.id
    const { line_orders, note, status } = req.body
    const updateOrder = await Order.query().upsertGraph(
      {
        id: orderId,
        note,
        detail: line_orders,
        status,
      },
      {
        relate: true,
        unrelate: true,
      },
    )

    return res.status(200).json({ data: { ...updateOrder } })
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

      return next(createHttpError(500, 'Error deleting order!'))
    } catch (err) {
      next(err)
    }
  }
}

export default new OrderController()
