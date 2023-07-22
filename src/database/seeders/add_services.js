/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('services').del();
  await knex('services').insert([
    { name: 'Catering', description: 'Cooking and serving all of all specified guests' },
    { name: 'Decor', description: 'All event decorations from start to finish' },
    { name: 'Music & Dance', description: 'Music and dance for events' },
    { name: 'Invitation & Gifts', description: 'Design of invitation cards, gifts ideas for all guests' },
  ]);
}
