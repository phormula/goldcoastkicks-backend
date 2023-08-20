export function up(knex: any) {
  return knex.schema.createTable('mail_templates', function (table: any) {
    table.bigIncrements('id')
    table.string('type', 100)
    table.string('subject')
    table.text('text')
    table.text('html')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('mail_templates')
}
