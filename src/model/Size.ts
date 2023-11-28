import ModelBase from '@model/ModelBase'
import Product from '@model/Product'

class Size extends ModelBase {
  id: number
  size_name: string
  origin_country: string
  description: string

  static get tableName() {
    return 'sizes'
  }

  static modifiers = {
    defaultSelects(query: any) {
      query.select('sizes.id', 'sizes.size_name', 'sizes.origin_country')
    },
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['size_name', 'origin_country'],
      properties: {
        id: { type: 'integer' },
        size_name: { type: 'string', minLength: 1, maxLength: 255 },
        origin_country: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string' },
      },
    }
  }

  static get relationMappings() {
    return {
      products: {
        relation: ModelBase.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'sizes.id',
          through: {
            from: 'product_sizes.size_id',
            to: 'product_sizes.product_id',
          },
          to: 'products.id',
        },
      },
    }
  }
}

export default Size
