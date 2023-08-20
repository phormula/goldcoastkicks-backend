import { Model } from 'objection'

class OrderItem extends Model {
  static get tableName() {
    return 'order_items'
  }
}

export default OrderItem
