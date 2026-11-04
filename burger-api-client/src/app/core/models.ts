export type Role = 'waiter' | 'chef' | 'admin';
export type MenuType = 'desayuno' | 'almuerzo';
export type OrderStatus = 'pending' | 'ready' | 'delivered';

export const ROLE_LABELS: Record<Role, string> = {
  waiter: 'Mesero/a',
  chef: 'Cocina',
  admin: 'Administración',
};

export const HOME_BY_ROLE: Record<Role, string> = {
  waiter: '/waiter',
  chef: '/kitchen',
  admin: '/admin',
};

export const MENU_LABELS: Record<MenuType, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo y cena',
};

/* Usuarios y sesión*/

export interface User {
  id: string | number;
  nombre: string;
  email: string;
  rol: Role;
}

export interface NewUser {
  nombre: string;
  email: string;
  rol: Role;
  password: string;
}

export type UserChanges = Partial<NewUser>;

export interface Credentials {
  email: string;
  password: string;
}

export interface Session {
  token: string;
  user: User;
}

/* Productos y carrito */

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  type: MenuType;
  dateEntry?: string;
}

export type NewProduct = Omit<Product, 'id' | 'dateEntry'>;
export type ProductChanges = Partial<NewProduct>;

export interface CartLine {
  product: Product;
  qty: number;
}

/* Pedidos */

export interface OrderItem {
  productId: string | number;
  product: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string | number;
  userId: string | number;
  waiterName: string;
  client: string;
  table: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  dateEntry: string;
  dateProcessed: string | null;
  dateDelivered: string | null;
}

export type NewOrder = Omit<Order, 'id'>;