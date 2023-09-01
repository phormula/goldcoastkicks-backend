import { Model } from 'objection'
import ExchangeRate from '@model/ExchangeRate'

class Currency extends Model {
  static get tableName() {
    return 'currencies'
  }

  static modifiers = {
    default(query: any) {
      query.select('currencies.id', 'currencies.name', 'currencies.code', 'currencies.symbol')
    },
  }

  static get relationMappings() {
    return {
      exchangeRatesFrom: {
        relation: Model.HasManyRelation,
        modelClass: ExchangeRate,
        join: {
          from: 'currencies.id',
          to: 'exchange_rates.from_currency_id',
        },
      },
      exchangeRatesTo: {
        relation: Model.HasManyRelation,
        modelClass: ExchangeRate,
        join: {
          from: 'currencies.id',
          to: 'exchange_rates.to_currency_id',
        },
      },
    }
  }
}

export default Currency
