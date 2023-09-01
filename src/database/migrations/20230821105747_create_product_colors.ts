import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_colorways', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.integer('product_id').unsigned()
    table.integer('colorway_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
    table.foreign('colorway_id').references('id').inTable('colorways').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('product_colorways')
}
