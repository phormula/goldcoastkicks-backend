import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('product_types', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.integer('product_id').unsigned()
    table.integer('type_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
    table.foreign('type_id').references('id').inTable('types').onDelete('CASCADE')
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('product_types')
}
