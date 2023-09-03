import { Model } from 'objection'
import OrderItem from '@model/OrderItem'
import OrderStatus from '@model/OrderStatus'
import User from '@model/User'

class Order extends Model {
  id: number | string
  note: string
  detail: any[]
  status: any[]
  user: User

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
    }
  }
}

export default Order
