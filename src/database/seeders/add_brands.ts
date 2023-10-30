import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('brands').del()

  // Inserts seed entries
  await knex('brands').insert([
    { name: 'Nike', description: 'Nike' },
    { name: 'Adidas', description: 'Adidas' },
    { name: 'Puma', description: 'Puma' },
    { name: 'Jordan', description: 'Jordan' },
    { name: 'Under Armour', description: 'Under Armour' },
  ])
}
