import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('product_courts', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.integer('product_id').unsigned()
    table.integer('court_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
    table.foreign('court_id').references('id').inTable('courts').onDelete('CASCADE')
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('product_courts')
}
