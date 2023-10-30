import { Model } from 'objection'
import Currency from '@model/Currency'

class Shipping extends Model {
  name: string
  amount: number
  duration: string
  currency: any
  static get tableName() {
    return 'shipping'
  }

  static get relationMappings() {
    return {
      currency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'shipping.currency_id',
          to: 'currencies.id',
        },
      },
    }
  }
}

export default Shipping
