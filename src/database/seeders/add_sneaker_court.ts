import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('courts').del()

  // Inserts seed entries
  await knex('courts').insert([
    { id: 1, name: 'Wide' },
    { id: 2, name: 'Narrow' },
    { id: 3, name: 'Smooth' },
  ])
}
