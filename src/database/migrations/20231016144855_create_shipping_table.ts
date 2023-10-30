import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('shipping', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.string('name')
    table.double('amount')
    table.string('duration')
    table.integer('currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('shipping')
}
