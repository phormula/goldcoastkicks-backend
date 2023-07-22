/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('mail_templates').del();
  await knex('mail_templates').insert([
    {
      type: 'register',
      subject: 'Welcome Account Creation Notification',
      text: `Welcome on board. Your account has been created successfully`,
      html: `<h3>Welcome on board</h3>
      <p>Your account has been created successfully</p>`,
    },
  ]);
}
