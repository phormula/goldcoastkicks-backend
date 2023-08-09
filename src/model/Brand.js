import { Model } from 'objection'
import Product from '@model/Product'

class Brand extends Model {
  static get tableName() {
    return 'brands'
  }

  name(query) {
    query.select('brands.name')
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
