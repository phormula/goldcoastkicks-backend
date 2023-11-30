import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('order_history', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.bigInteger('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
    table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.text('data')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('order_history')
}
