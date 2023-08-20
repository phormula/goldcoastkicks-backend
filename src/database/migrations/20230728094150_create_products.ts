export function up(knex: any) {
  return knex.schema.createTable('products', function (table: any) {
    table.increments('id')
    table.string('name', 255)
    table.text('description')
    table.double('price')
    table.string('sku', 255).unique()
    table.string('image', 255)
    table.integer('brand_id', 255).nullable().unsigned()
    table.integer('colorway_id', 255).nullable().unsigned()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table.foreign('brand_id').references('id').inTable('brands').onDelete('CASCADE')

    table.foreign('colorway_id').references('id').inTable('colorways').onDelete('CASCADE')
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('products')
}
