import { Model } from 'objection'
import Product from '@model/Product'

class Court extends Model {
  static get tableName() {
    return 'courts'
  }

  static modifiers = {
    defaultSelects(query) {
      query.select('courts.id', 'courts.name')
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
          from: 'courts.id',
          through: {
            from: 'product_courts.court_id',
            to: 'product_courts.product_id',
          },
          to: 'products.id',
        },
      },
    }
  }
}

export default Court
