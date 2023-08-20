import 'dotenv/config'
import { hashSync } from 'bcrypt'

export async function seed(knex: any) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      first_name: 'Evans',
      last_name: 'Teiko',
      email: 'phormulabackup@gmail.com',
      password: hashSync('password', Number(process.env.SALT)),
    },
  ])
  await knex('user_roles').del()
  await knex('user_roles').insert([{ user_id: 1, role_id: 1 }])
}
