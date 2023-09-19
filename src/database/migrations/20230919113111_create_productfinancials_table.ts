import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_financials', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
    table.double('profit_percent')
    table.double('tax_percent')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('product_financials')
}
