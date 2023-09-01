import { Model } from 'objection'
import Currency from '@model/Currency'

class Brand extends Model {
  static get tableName() {
    return 'exchange_rates'
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
      fromCurrency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'exchange_rates.from_currency_id',
          to: 'currencies.id',
        },
      },
      toCurrency: {
        relation: Model.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'exchange_rates.to_currency_id',
          to: 'currencies.id',
        },
      },
    }
  }
}

export default Brand
