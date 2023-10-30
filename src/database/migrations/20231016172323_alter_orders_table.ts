import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('orders', function (table: Knex.TableBuilder) {
    table.integer('shipping_id').unsigned().references('id').inTable('shipping').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('orders', function (table: Knex.TableBuilder) {
    table.dropForeign('shipping_id')
    table.dropColumn('shipping_id')
  })
}
