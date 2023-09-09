import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('types').del()

  // Inserts seed entries
  await knex('types').insert([
    { id: 1, name: 'High' },
    { id: 2, name: 'Mid' },
    { id: 3, name: 'Low' },
  ])
}
