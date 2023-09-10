import { Knex } from 'knex'

export function up(knex: Knex) {
  return knex.schema
    .createTable('currencies', function (table: Knex.TableBuilder) {
      table.increments('id')
      table.string('symbol')
      table.string('code').unique()
      table.string('name').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('exchange_rates', function (table: Knex.TableBuilder) {
      table.bigIncrements('id')
      table.integer('from_currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
      table.integer('to_currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
      table.decimal('rate').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('products', function (table: Knex.TableBuilder) {
      table.increments('id')
      table.string('name', 255)
      table.text('description')
      table.decimal('buying_price').notNullable()
      table.decimal('selling_price').notNullable()
      table.integer('buying_currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
      table.integer('selling_currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
      table.string('sku', 255).unique()
      table.string('image', 255)
      table.integer('brand_id', 255).nullable().unsigned().references('id').inTable('brands').onDelete('CASCADE')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export function down(knex: Knex) {
  return knex.schema.dropTableIfExists('products').dropTableIfExists('exchange_rates').dropTableIfExists('currencies')
}
