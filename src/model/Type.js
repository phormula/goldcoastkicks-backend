import { Model } from 'objection'
import Product from '@model/Product'

class Type extends Model {
  static get tableName() {
    return 'types'
  }

  static modifiers = {
    defaultSelects(query) {
      query.select('types.id', 'types.name')
    },
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'types.id',
          through: {
            from: 'product_types.type_id',
            to: 'product_types.product_id',
          },
          to: 'products.id',
        },
      },
    }
  }
}

export default Type
