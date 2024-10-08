import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_addresses', function (table: Knex.TableBuilder) {
    table.increments('id')
    table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.string('address')
    table.string('house_no')
    table.string('town')
    table.string('city')
    table.string('region')
    table.string('country').defaultTo('Ghana')
    table.boolean('is_default').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_addresses')
}
