export function up(knex: any) {
  return knex.schema.createTable('services', function (table: any) {
    table.bigIncrements('id')
    table.string('name', 255).unique()
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('services')
}
