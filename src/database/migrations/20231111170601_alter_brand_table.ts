import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('brands', function (table: Knex.TableBuilder) {
    table.string('image')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('brands', function (table: Knex.TableBuilder) {
    table.dropColumn('image')
  })
}
