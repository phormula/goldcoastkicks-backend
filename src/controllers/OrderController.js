import Order from '@app/model/Order'
import OrderStatus from '@app/model/OrderStatus'

class OrderController {
  async getAllOrders(req, res, next) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`

      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 15
      const offset = (page - 1) * limit
      const orders = await Order.query()
        .select('orders.*', 'status.key as status_key', 'status.value as status_value', 'status.color as status_color')
        .leftJoinRelated('status')
        .limit(limit)
        .offset(offset)

      const totalOrders = await Order.query().count('id').first()

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

  async getOrder(req, res, next) {
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

  async createOrder(req, res, next) {
    try {
      const { line_orders, note } = req.body

      console.log(line_orders)
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

  updateOrder(req, res, next) {
    // Update a product in the database based on the data from the request body
    const productId = req.params.id
    Order.findByIdAndUpdate(productId, req.body, { new: true }, (err, product) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while updating the product.' })
      } else {
        res.json(product)
      }
    })
  }

  deleteOrder(req, res, next) {
    // Delete a product from the database based on its ID
    const productId = req.params.id
    Order.findByIdAndDelete(productId, (err) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred while deleting the product.' })
      } else {
        res.json({ message: 'Order deleted successfully.' })
      }
    })
  }
}

export default new OrderController()
