import ModelBase from '@model/ModelBase'
import OrderItem from '@model/OrderItem'
import OrderStatus from '@model/OrderStatus'
import User from '@model/User'
import Shipping from '@model/Shipping'
import Currency from '@model/Currency'
import OrderHistory from '@model/OrderHistory'

class Order extends ModelBase {
  id: number | string
  user_id: number
  note: string
  detail: any[]
  status: any[]
  order_status_id: number
  user: User
  shipping: Shipping
  currency: Currency
  shipping_amount: number
  shipping_id: number

  static get tableName() {
    return 'orders'
  }

  static get relationMappings() {
    return {
      detail: {
        relation: ModelBase.HasManyRelation,
        modelClass: OrderItem,
        join: {
          from: 'orders.id',
          to: 'order_items.order_id',
        },
      },
      status: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: OrderStatus,
        join: {
          from: 'orders.order_status_id',
          to: 'order_statuses.id',
        },
      },
      history: {
        relation: ModelBase.HasManyRelation,
        modelClass: OrderHistory,
        join: {
          from: 'orders.id',
          to: 'order_history.order_id',
        },
      },
      user: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'orders.user_id',
          to: 'users.id',
        },
      },
      shipping: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Shipping,
        join: {
          from: 'orders.shipping_id',
          to: 'shipping.id',
        },
      },
      currency: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'orders.currency_id',
          to: 'currencies.id',
        },
      },
    }
  }
}

export default Order
