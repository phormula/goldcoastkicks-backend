import ModelBase from '@model/ModelBase'
import Product from '@model/Product'
import Colorway from './Colorway'

class ProductGallery extends ModelBase {
  id: number
  product_id: number
  image: string
  colorway_id: number

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
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'product_gallery.product_id',
          to: 'products.id',
        },
      },
      color: {
        relation: ModelBase.BelongsToOneRelation,
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
