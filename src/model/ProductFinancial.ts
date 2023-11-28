import ModelBase from '@model/ModelBase'
import Product from '@model/Product'

class ProductFinancial extends ModelBase {
  id: number
  product_id: number
  product: any[]
  profit_percent: string
  tax_percent: string

  static get tableName() {
    return 'product_financials'
  }

  // static get jsonSchema() {
  //   return {
  //     type: 'object',
  //     required: ['product_id', 'image'],
  //     properties: {
  //       id: { type: 'integer' },
  //       product_id: { type: 'integer' },
  //       image: { type: 'string' },
  //     },
  //   }
  // }

  static get relationMappings() {
    return {
      product: {
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'product_financials.product_id',
          to: 'products.id',
        },
      },
    }
  }
}

export default ProductFinancial
