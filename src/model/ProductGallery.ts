import { Model } from 'objection'
import Product from '@model/Product'
import Colorway from './Colorway'

class ProductGallery extends Model {
  id: number
  product_id: number
  image: string
  created_at: string
  updated_at: string

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
      color: {
        relation: Model.BelongsToOneRelation,
        modelClass: Colorway,
        join: {
          from: 'product_gallery.colorway_id',
          to: 'colorways.id',
        },
      },
    }
  }
}

export default ProductGallery
