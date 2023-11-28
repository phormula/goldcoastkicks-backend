import ModelBase from '@model/ModelBase'
import ExchangeRate from '@model/ExchangeRate'

class Currency extends ModelBase {
  id: number
  name: string
  symbol: string
  code: string

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
        relation: ModelBase.HasManyRelation,
        modelClass: ExchangeRate,
        join: {
          from: 'currencies.id',
          to: 'exchange_rates.from_currency_id',
        },
      },
      exchangeRatesTo: {
        relation: ModelBase.HasManyRelation,
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
