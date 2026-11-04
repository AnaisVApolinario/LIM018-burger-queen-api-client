import { Order, Product, User } from 'src/app/core/models';

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  nombre: 'Ana Mesera',
  email: 'ana@amero.com',
  rol: 'waiter',
  ...overrides,
});

export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '01',
  name: 'Café americano',
  price: 5,
  image: 'assets/americano.jpg',
  type: 'desayuno',
  ...overrides,
});

export const makeOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 1,
  userId: '1',
  waiterName: 'Ana Mesera',
  client: 'Luis',
  table: '4',
  products: [{ productId: '01', product: 'Café americano', price: 5, qty: 2 }],
  total: 10,
  status: 'pending',
  dateEntry: '2026-10-12T12:00:00.000Z',
  dateProcessed: null,
  dateDelivered: null,
  ...overrides,
});