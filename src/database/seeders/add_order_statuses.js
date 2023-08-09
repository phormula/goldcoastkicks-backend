/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('order_statuses').del()
  await knex('order_statuses').insert([
    { key: 'placed', value: 'Order placed', color: '#F7B924', description: 'Order has been placed' },
    {
      key: 'acknowledged',
      value: 'Order Acknoledged',
      color: '#FFA500',
      description: 'Order has been acknowledged by Admin',
    },
    { key: 'waiting', value: 'Waiting for Payment', color: '#00FFFF', description: 'Waiting for payment' },
    { key: 'confirm', value: 'Confirmed', color: '#FF4500', description: 'Order has been confirmed by Customer' },
    {
      key: 'prepared',
      value: 'Order is being prepared for Shipment',
      color: '#32CD32',
      description: 'Order is being prepared for Shipment',
    },
    { key: 'shipped', value: 'Order has been Shipped', color: '#1E90FF', description: 'Order has been Shipped' },
    {
      key: 'received',
      value: 'Shipement has been Received',
      color: '#9400D3',
      description: 'Shipment has been Received by Customer',
    },
    { key: 'complete', value: 'Order has been completed', color: '#00FF00', description: 'Order has been Completed' },
    { key: 'cancelled', value: 'Order has been cancelled', color: '#FF0000', description: 'Order cancelled' },
  ])
}
