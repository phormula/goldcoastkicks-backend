import { Request, Response, NextFunction } from 'express'
import Order from '@app/model/Order'
import OrderStatus from '@app/model/OrderStatus'
import createHttpError from 'http-errors'

class OrderController {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 15
      const offset = (page - 1) * limit
      const orders = await Order.query()
        .select('orders.*', 'status.key as status_key', 'status.value as status_value', 'status.color as status_color')
        .leftJoinRelated('status')
        .limit(limit)
        .offset(offset)

      const totalOrders = (await Order.query().count('id').first()) as { [key: string]: any }

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
      const order = await Order.query().findById(req.params.id).withGraphFetched('[detail, status]')

      if (order) {
        res.send({ data: { ...order } })
      } else {
        res.status(404).send({ status: 'error', message: 'Order not found' })
      }
    } catch (err) {
      return next(err)
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { line_orders, note } = req.body

      const orderStatus = await OrderStatus.query().findOne({ key: 'placed' })
      const order = await Order.query().upsertGraph(
        [
          {
            note,
            detail: line_orders,
            status: [orderStatus],
          },
        ],
        { relate: ['detail', 'status'] },
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
