import { Model, QueryBuilder } from 'objection'
import Product from '@model/Product'

class Colorway extends Model {
  id: number | string
  name: string
  color_code: string
  darkness: string
  description: string

  static get tableName() {
    return 'colorways'
  }

  static modifiers = {
    default(query: any) {
      query.select('colorways.id', 'colorways.name', 'color_code', 'darkness')
    },
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'color_code'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        color_code: { type: 'string' },
        darkness: { type: 'string' },
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
