import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('product_gallery', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.integer('product_id').unsigned()
    table.string('image', 255)
    table.integer('colorway_id').unsigned().references('id').inTable('colorways').onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('product_gallery')
}
