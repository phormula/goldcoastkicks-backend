import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('users', function (table: Knex.TableBuilder) {
    table.bigIncrements('id')
    table.string('first_name', 255).notNullable()
    table.string('last_name', 255).notNullable()
    table.string('email').unique()
    table.timestamp('email_verified_at').nullable()
    table.string('password')
    // table.rememberToken();
    table.string('phone_1').unique().nullable()
    table.string('phone_2').unique().nullable()
    table.string('whatsapp').unique().nullable()
    table.boolean('is_disabled').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('users')
}
