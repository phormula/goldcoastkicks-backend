import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('mail_templates', function (table: Knex.TableBuilder) {
    table.bigIncrements('id')
    table.string('type', 100)
    table.string('subject')
    table.text('text')
    table.text('html')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('mail_templates')
}
