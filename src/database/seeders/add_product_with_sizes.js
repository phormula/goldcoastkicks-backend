/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    {
      name: 'Product 1',
      description: 'Sample product description',
      sku: '651651561dsc',
      image: 'pro_1.jpg',
    },
  ])

  await knex('sizes').del()
  await knex('sizes').insert([
    { size_name: '42', origin_country: 'UK', description: 'Big size' },
  ])

  await knex('product_sizes').del()
  await knex('product_sizes').insert([{ product_id: 1, size_id: 1 }])

  await knex('product_gallery').del()
  await knex('product_gallery').insert([
    { product_id: 1, image: 'pro_gallery_1' },
  ])
}
