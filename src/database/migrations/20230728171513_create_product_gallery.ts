export function up(knex: any) {
  return knex.schema.createTable('product_gallery', function (table: any) {
    table.increments('id')
    table.integer('product_id').unsigned()
    table.string('image', 255)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('product_gallery')
}
