import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('product_gallery', (table: Knex.AlterTableBuilder) => {
    table.integer('colorway_id').unsigned().references('id').inTable('colorways').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('product_gallery', (table: Knex.AlterTableBuilder) => {
    table.dropForeign('colorway_id')
    table.dropColumn('colorway_id')
  })
}
