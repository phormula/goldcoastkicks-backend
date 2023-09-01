import { Model } from 'objection'
import Product from '@model/Product'

class Colorway extends Model {
  static get tableName() {
    return 'colorways'
  }

  static modifiers = {
    default(query: any) {
      query.select('colorways.id', 'colorways.name')
    },
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'coloways.id',
          through: {
            from: 'product_coloways.coloway_id',
            to: 'product_coloways.product_id',
          },
          to: 'products.id',
        },
      },
    }
  }
}

export default Colorway
