import ModelBase from '@model/ModelBase'
import Currency from '@model/Currency'

class Shipping extends ModelBase {
  id: string | number
  name: string
  amount: number
  duration: string
  currency: Currency
  currency_id: any
  static get tableName() {
    return 'shipping'
  }

  static get relationMappings() {
    return {
      currency: {
        relation: ModelBase.BelongsToOneRelation,
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
