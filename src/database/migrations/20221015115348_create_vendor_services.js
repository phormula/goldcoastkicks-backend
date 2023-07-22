/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('vendor_services', function (table) {
    table.bigIncrements('id');
    table.bigInteger('vendor_id').unsigned();
    table.bigInteger('service_id').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('vendor_id').references('id').inTable('vendors').onDelete('CASCADE');
    table.foreign('service_id').references('id').inTable('services').onDelete('CASCADE');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('vendor_services');
}
