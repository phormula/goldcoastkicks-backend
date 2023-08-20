export function up(knex: any) {
  return knex.schema.createTable('roles', function (table: any) {
    table.bigIncrements('id')
    table.string('key', 255).unique()
    table.string('name', 255)
    table.string('description', 255)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('roles')
}
