import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema.createTable('role_permissions', function (table: Knex.TableBuilder) {
    table.bigIncrements('id')
    table.bigInteger('role_id').unsigned()
    table.bigInteger('permission_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE')
    table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE')
  })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('role_permissions')
}
