import { Model } from 'objection'
import Product from '@model/Product'

class Colorway extends Model {
  static get tableName() {
    return 'colorways'
  }

  static modifiers = {
    name(query: any) {
      query.select('colorways.name')
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
          from: 'colorways.id',
          to: 'products.colorway_id',
        },
      },
    }
  }
}

export default Colorway
