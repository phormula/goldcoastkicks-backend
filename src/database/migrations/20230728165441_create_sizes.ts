export function up(knex: any) {
  return knex.schema.createTable('sizes', function (table: any) {
    table.increments('id')
    table.string('size_name', 255)
    table.string('origin_country', 255)
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('sizes')
}
