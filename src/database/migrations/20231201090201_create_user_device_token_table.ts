import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_device_tokens', (table) => {
    table.increments('id').primary()
    table.bigInteger('user_id').unsigned().references('id').inTable('users')
    table.string('device_type', 10)
    table.text('device_token')
    table.string('device_token_type')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_device_tokens')
}
