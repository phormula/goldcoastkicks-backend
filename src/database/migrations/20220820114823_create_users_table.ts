export function up(knex: any) {
  return knex.schema.createTable('users', function (table: any) {
    table.bigIncrements('id')
    table.string('first_name', 255).notNullable()
    table.string('last_name', 255).notNullable()
    table.string('email').unique()
    table.timestamp('email_verified_at').nullable()
    table.string('password')
    // table.rememberToken();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export function down(knex: any) {
  return knex.schema.dropTable('users')
}
