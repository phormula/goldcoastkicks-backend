/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {
      name: 'super-admin',
      description: 'Has elevated access, can manage other admins, and has dev access',
    },
    {
      name: 'admin',
      description: 'Has business administrative access to manage all aspects of the business',
    },
    {
      name: 'customer',
      description: 'Can only browse and book services',
    },
  ])
}
