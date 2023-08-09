import { Model } from 'objection'
import Product from '@model/Product'

class ProductGallery extends Model {
  static get tableName() {
    return 'product_gallery'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['product_id', 'image'],
      properties: {
        id: { type: 'integer' },
        product_id: { type: 'integer' },
        image: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'product_gallery.product_id',
          to: 'products.id',
        },
      },
    }
  }
}

export default ProductGallery
