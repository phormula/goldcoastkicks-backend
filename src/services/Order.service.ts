import { isAdmin } from '@app/helpers'
import Order from '@model/Order'
import OrderStatus from '@model/OrderStatus'
import User from '@model/User'
import MailService from '@app/services/Mail.service'
import OrderItem from '@model/OrderItem'
import OrderHistory from '@app/model/OrderHistory'

class OrderService {
  async getAllOrders(user: User, requestQuery: { [key: string]: any }) {
    try {
      const { page, limit } = requestQuery
      const pageData = page ? Number(page) : 1
      const limitData = limit ? Number(limit) : 15
      const offset = (pageData - 1) * limitData

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
        .limit(limitData)
        .offset(offset)

      let countQuery = Order.query()

      if (!isAdmin(user)) {
        orderQuery = orderQuery.where('user_id', Number(user.id))
        countQuery = countQuery.where('user_id', Number(user.id))
      }

      const orders = await orderQuery
      const totalOrders = (await countQuery.count('id').first()) as { [key: string]: any }

      return {
        data: orders,
        current_page: pageData,
        per_page: limitData,
        total: totalOrders['count(`id`)'],
        last_page: Math.ceil(totalOrders['count(`id`)'] / limit),
      }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getOrder(id: string | number) {
    try {
      const order = await Order.query()
        .findById(id)
        .withGraphFetched('[detail.product(customerSelect), status, user(defaultSelects)]')
        .withGraphFetched('[shipping, currency, history.user(defaultSelects)]')

      if (order) {
        return { data: { ...order } }
      }
      return { status: 'error', message: 'Order not found' }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createOrder(data: { [key: string]: any }, reqUser: User) {
    try {
      const { line_orders, note, user, shipping_id, shipping_amount, currency_id } = data

      const userOrdered = user || reqUser.id
      const orderStatus = await OrderStatus.query().findOne({ key: 'placed' })
      const order = await Order.query().insertGraph(
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

      return { data: { ...order } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateOrder(orderId: string | number, data: { [key: string]: any }, user: User) {
    try {
      const { line_orders, note, user_id, shipping_id, shipping_amount, status_id } = data
      const updateOrder = await Order.query().updateAndFetchById(orderId, {
        note,
        user_id,
        order_status_id: status_id,
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
      return { data: { ...updateOrder } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteOrder(id: string) {
    try {
      const order = await Order.query().findById(id)

      if (order) {
        await order.$relatedQuery('detail').unrelate()
        await order.$query().delete()

        return { data: { status: 'success', message: 'Order deleted successfully' } }
      }

      return { data: { status: 'error', message: 'Error deleting order!' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  // Order History

  async getOrderHistory(id: string | number) {
    try {
      const orderHistory = await OrderStatus.query().findById(id)

      return { data: { ...orderHistory } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createOrderHistory(orderId: string | number, user: User) {
    try {
      const orderData = await this.getOrder(orderId)
      const orderHistory = await OrderHistory.query().insertGraph(
        {
          order: { id: Number(orderData.data?.id) },
          data: JSON.stringify(orderData.data),
          user,
        },
        { relate: true },
      )

      return { data: orderHistory }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteOrderHistory(id: string | number) {
    try {
      await OrderHistory.query().findById(id).delete()

      return { data: { status: 'success', message: 'Order history deleted successfully' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  // Order Status
  async orderStatus() {
    try {
      const orderStatus = await OrderStatus.query()

      return { data: orderStatus }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async getOrderStatus(id: string | number) {
    try {
      const orderStatus = await OrderStatus.query().findById(id)

      return { data: { ...orderStatus } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async createOrderStatus(data: { [key: string]: any }) {
    try {
      const orderStatus = await OrderStatus.query().insert(data)

      return { data: orderStatus }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async updateOrderStatus(id: string | number, data: { [key: string]: any }) {
    try {
      const orderStatus = await OrderStatus.query().update(data).where({ id })

      return { data: orderStatus }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  async deleteOrderStatus(id: string | number) {
    try {
      await OrderStatus.query().findById(id).delete()

      return { data: { status: 'success', message: 'Order status deleted successfully' } }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}

export default new OrderService()
