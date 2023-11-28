import ModelBase from '@model/ModelBase'
import Product from '@model/Product'
import Order from '@model/Order'

class OrderItem extends ModelBase {
  static get tableName() {
    return 'order_items'
  }

  static get relationMappings() {
    return {
      product: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'order_items.product_id',
          to: 'products.id',
        },
      },
      order: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'order_items.order_id',
          to: 'orders.id',
        },
      },
    }
  }
}

export default OrderItem
