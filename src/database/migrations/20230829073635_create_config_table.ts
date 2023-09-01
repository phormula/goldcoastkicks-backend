import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('configs', (table: Knex.CreateTableBuilder) => {
    table.increments('id')
    table.string('key').unique()
    table.string('value')
    table.string('table_name')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('configs')
}
