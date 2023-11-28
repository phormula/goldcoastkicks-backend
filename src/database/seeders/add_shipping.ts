import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('shipping').del()

  // Inserts seed entries
  await knex('shipping').insert([{ name: 'Standard', amount: 10.0, duration: '3-5 days', currency_id: 182 }])
}
