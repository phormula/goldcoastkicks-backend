export function up(knex: any) {
  return knex.schema.createTable('brands', function (table: any) {
    table.increments('id')
    table.string('name', 255)
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('brands')
}
