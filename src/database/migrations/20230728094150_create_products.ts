import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('products', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.string('name', 255)
    table.text('description')
    table.double('price')
    table.string('sku', 255).unique()
    table.string('image', 255)
    table.integer('brand_id', 255).nullable().unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('brand_id').references('id').inTable('brands').onDelete('CASCADE')
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('products')
}
