import { Model } from 'objection'
import Product from '@model/Product'

class Position extends Model {
  static get tableName() {
    return 'positions'
  }

  static modifiers = {
    defaultSelects(query) {
      query.select('positions.id', 'positions.name')
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
          from: 'positions.id',
          through: {
            from: 'product_positions.position_id',
            to: 'product_positions.product_id',
          },
          to: 'products.id',
        },
      },
    }
  }
}

export default Position
