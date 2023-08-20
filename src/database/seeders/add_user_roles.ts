export async function seed(knex: any) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {
      key: 'super-admin',
      name: 'Super Admin',
      description: 'Has elevated access, can manage other admins, and has dev access',
    },
    {
      key: 'admin',
      name: 'Admin',
      description: 'Has business administrative access to manage all aspects of the business',
    },
    {
      key: 'customer',
      name: 'Customer',
      description: 'Can only browse and book services',
    },
  ])
}
