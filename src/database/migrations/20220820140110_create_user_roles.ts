export function up(knex: any) {
  return knex.schema.createTable('user_roles', function (table: any) {
    table.bigIncrements('id')
    table.bigInteger('user_id').unsigned()
    table.bigInteger('role_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('user_roles')
}
