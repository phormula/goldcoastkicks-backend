import { Knex } from 'knex'
import CurrencyConverterService from '../../services/currency-converter.service'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('configs').del()

  // Inserts seed entries
  await knex('configs').insert([
    { key: 'buying_currency', value: 'cny', table_name: 'currencies' },
    { key: 'selling_currency', value: 'ghc', table_name: 'currencies' },
  ])

  const currencies = await CurrencyConverterService.getCurrucies()
  await knex('currencies').del()
  await knex('currencies').insert(currencies)
  await knex('currencies').where({ code: 'cny' }).update({
    symbol: '<span>&#20803;</span>',
  })
  await knex('currencies').where({ code: 'ghc' }).update({
    symbol: 'GH<span>&#8373;</span>',
  })
  await knex('currencies').where({ code: 'ghs' }).update({
    symbol: 'GH<span>&#8373;</span>',
  })
}
