import { Model } from 'objection'
import OrderItem from '@model/OrderItem'
import OrderStatus from '@model/OrderStatus'

class Order extends Model {
  note: string
  detail: any[]
  status: any[]

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
    }
  }
}

export default Order
