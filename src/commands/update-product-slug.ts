import Product from '@model/Product'
import db from '@app/database/knexdb'
import { Model } from 'objection'
import { createUniqueProductSlug } from '@app/helpers'

async function run() {
  const products = await Product.query()

  for (let i = 0; i < products.length; i++) {
    let id = products[i].id
    let productWithSlugs = await Product.query().whereNotNull('slug')
    const existingSlugs = productWithSlugs.map((p) => p.slug)

    let slug = createUniqueProductSlug(products[i].name, existingSlugs)

    await db('products').where({ id }).update({ slug })
  }

  console.log('Products Slug added')
}
Model.knex(db)
run().then((_) => process.exit())
