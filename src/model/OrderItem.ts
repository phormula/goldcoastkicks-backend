import { Model } from 'objection'
import Product from '@model/Product'

class OrderItem extends Model {
  static get tableName() {
    return 'order_items'
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'order_items.product_id',
          to: 'products.id',
        },
      },
    }
  }
}

export default OrderItem
