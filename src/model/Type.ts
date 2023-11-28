import ModelBase from '@model/ModelBase'
import Product from '@model/Product'

class Type extends ModelBase {
  id: number
  name: string
  description: string

  static get tableName() {
    return 'types'
  }

  static modifiers = {
    defaultSelects(query: any) {
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
        relation: ModelBase.ManyToManyRelation,
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
