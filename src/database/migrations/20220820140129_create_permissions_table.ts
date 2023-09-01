import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('permissions', function (table: Knex.TableBuilder) {
    table.bigIncrements('id')
    table.string('name', 255)
    table.string('guard_name', 255)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('permissions')
}
