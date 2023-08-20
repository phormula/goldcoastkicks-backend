export function up(knex: any) {
  return knex.schema.createTable('role_permissions', function (table: any) {
    table.bigIncrements('id')
    table.bigInteger('role_id').unsigned()
    table.bigInteger('permission_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
    table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE')
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('role_permissions')
}
