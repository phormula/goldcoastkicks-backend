import { Knex } from 'knex'

export function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('order_statuses', function (table: Knex.TableBuilder) {
      table.increments('id')
      table.string('key', 255).unique()
      table.string('value', 255)
      table.string('color', 255)
      table.text('description')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('orders', function (table: Knex.TableBuilder) {
      table.bigIncrements('id')
      table.integer('order_status_id').unsigned().references('id').inTable('order_statuses')
      table.text('note')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('order_items', (table: Knex.TableBuilder) => {
      table.increments('id').primary()
      table.bigInteger('order_id').unsigned().references('id').inTable('orders')
      table.integer('quantity')
      table.integer('product_id').unsigned()
      table.double('price')
      table.string('size', 255)
      table.string('colour', 255)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())

      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE')
    })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('order_items').dropTableIfExists('orders').dropTableIfExists('order_statuses')
}
