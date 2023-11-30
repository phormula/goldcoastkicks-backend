import ModelBase from '@model/ModelBase'
import Order from '@model/Order'
import User from '@model/User'

class OrderHistory extends ModelBase {
  id: number
  order_id: number
  data: string
  order: Order
  user: User

  static get tableName() {
    return 'order_history'
  }

  static get relationMappings() {
    return {
      user: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'order_history.user_id',
          to: 'users.id',
        },
      },
      order: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'order_history.order_id',
          to: 'orders.id',
        },
      },
    }
  }
}

export default OrderHistory
