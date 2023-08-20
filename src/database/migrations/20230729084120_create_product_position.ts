export function up(knex: any) {
  return knex.schema.createTable('product_positions', function (table: any) {
    table.increments('id')
    table.integer('product_id').unsigned()
    table.integer('position_id').unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
    table.foreign('position_id').references('id').inTable('positions').onDelete('CASCADE')
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('product_positions')
}
