export function up(knex: any) {
  return knex.schema.createTable('permissions', function (table: any) {
    table.bigIncrements('id')
    table.string('name', 255)
    table.string('guard_name', 255)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('permissions')
}
