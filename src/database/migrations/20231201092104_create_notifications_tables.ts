import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('notifications', (table) => {
      table.increments('id').primary()
      table.bigInteger('user_id').unsigned().references('id').inTable('users')
      table.integer('entity_id').unsigned().references('id').inTable('entities')
      table.text('message')
      table.boolean('is_sent').defaultTo(false)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('email_notifications', (table) => {
      table.increments('id').primary()
      table.integer('notification_id').unsigned().references('id').inTable('notifications')
      table.string('email_address')
      table.string('subject')
      table.string('body')
      table.boolean('email_sent').defaultTo(false)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
    .createTable('push_notifications', (table) => {
      table.increments('id').primary()
      table.integer('notification_id').unsigned().references('id').inTable('notifications')
      table.integer('device_id').unsigned().references('id').inTable('user_device_tokens')
      table.boolean('push_sent').defaultTo(false)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('push_notifications')
    .dropTableIfExists('email_notifications')
    .dropTableIfExists('notifications')
}
