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
      table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('order_status_id').unsigned().references('id').inTable('order_statuses').onDelete('CASCADE')
      table.text('note')
      table.integer('currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
      table.integer('shipping_id').unsigned().references('id').inTable('shipping').onDelete('CASCADE')
      table.double('shipping_amount')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('order_items', (table: Knex.TableBuilder) => {
      table.increments('id').primary()
      table.bigInteger('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table.integer('quantity')
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.integer('colorway_id').unsigned().references('id').inTable('colorways').onDelete('CASCADE')
      table.double('price')
      table.string('size')
      table.string('colour')
      table.string('image')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('order_items').dropTableIfExists('orders').dropTableIfExists('order_statuses')
}
