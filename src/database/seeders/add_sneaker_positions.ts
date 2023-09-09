import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('positions').del()

  // Inserts seed entries
  await knex('positions').insert([
    { id: 1, name: 'Guard' },
    { id: 2, name: 'Forward' },
    { id: 3, name: 'Center' },
  ])
}
