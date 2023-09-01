import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('configs').del()

  // Inserts seed entries
  await knex('configs').insert([
    { key: 'buying_currency', value: 'cny', table_name: 'currencies' },
    { key: 'selling_currency', value: 'ghc', table_name: 'currencies' },
  ])
}
