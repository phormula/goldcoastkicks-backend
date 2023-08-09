/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('products', function (table) {
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('products')
}
