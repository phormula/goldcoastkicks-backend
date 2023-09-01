import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('colorways', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.string('name', 255)
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('colorways')
}
