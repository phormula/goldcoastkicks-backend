import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('products', function (table: Knex.TableBuilder) {
    table.string('slug').unique()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('products', function (table: Knex.TableBuilder) {
    table.dropColumn('slug')
  })
}
