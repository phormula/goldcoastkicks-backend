import ModelBase from '@model/ModelBase'
import Currency from '@model/Currency'

class Brand extends ModelBase {
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
        relation: ModelBase.BelongsToOneRelation,
        modelClass: Currency,
        join: {
          from: 'exchange_rates.from_currency_id',
          to: 'currencies.id',
        },
      },
      toCurrency: {
        relation: ModelBase.BelongsToOneRelation,
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
