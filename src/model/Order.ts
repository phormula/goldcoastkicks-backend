import { Model } from 'objection'
import OrderItem from '@model/OrderItem'
import OrderStatus from '@model/OrderStatus'
import User from '@model/User'
import Shipping from '@model/Shipping'

class Order extends Model {
  id: number | string
  note: string
  detail: any[]
  status: any[]
  user: User
  shipping: Shipping

  static get tableName() {
    return 'orders'
  }

  static get relationMappings() {
    return {
      detail: {
        relation: Model.HasManyRelation,
        modelClass: OrderItem,
        join: {
          from: 'orders.id',
          to: 'order_items.order_id',
        },
      },
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: OrderStatus,
        join: {
          from: 'orders.order_status_id',
          to: 'order_statuses.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'orders.user_id',
          to: 'users.id',
        },
      },
      shipping: {
        relation: Model.BelongsToOneRelation,
        modelClass: Shipping,
        join: {
          from: 'orders.shipping_id',
          to: 'shipping.id',
        },
      },
    }
  }
}

export default Order
