import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
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
    .alterTable('products', (table: Knex.TableBuilder) => {
      table.dropColumn('price')
      table.decimal('selling_price').notNullable()
      table.integer('buying_currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
      table.integer('selling_currency_id').unsigned().references('id').inTable('currencies').onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .table('products', async (table: Knex.TableBuilder) => {
      table.dropColumn('buying_price')
      table.dropForeign('buying_currency_id')
      table.dropColumn('buying_currency_id')
      table.dropForeign('selling_currency_id')
      table.dropColumn('selling_currency_id')

      const hasPriceColumn = await knex.schema.hasColumn('products', 'price')
      hasPriceColumn ? table.dropColumn('price') : table.double('price')
    })
    .dropTableIfExists('exchange_rates')
    .dropTableIfExists('currencies')
}
