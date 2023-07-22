/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vendor_categories').del();
  await knex('vendor_categories').insert([
    { name: 'Wedding', description: 'Cooking and serving all of all specified guests' },
    { name: 'Live Events', description: 'Cooking and serving all of all specified guests' },
    { name: 'Funerals', description: 'Cooking and serving all of all specified guests' },
    { name: 'Party', description: 'Cooking and serving all of all specified guests' },
    { name: 'Baby Outdoorings', description: 'Cooking and serving all of all specified guests' },
  ]);
}
