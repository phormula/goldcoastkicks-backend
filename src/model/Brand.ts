import { Model } from 'objection'
import Product from '@model/Product'

class Brand extends Model {
  name: string
  image: string
  description: string

  static get tableName() {
    return 'brands'
  }

  static modifiers = {
    default(query: any) {
      query.select('brands.id', 'brands.name')
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
      product: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'brands.id',
          to: 'products.brand_id',
        },
      },
    }
  }
}

export default Brand
