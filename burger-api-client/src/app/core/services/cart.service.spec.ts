import { TestBed } from '@angular/core/testing';
import { makeProduct } from 'src/testing/factories';
import { CartService } from './cart.service';

describe('CartService', () => {
  const coffee = makeProduct({ id: '01', name: 'Café', price: 5 });
  const burger = makeProduct({ id: '05', name: 'Hamburguesa', price: 10.1 });
  let cart: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cart = TestBed.inject(CartService);
  });

  it('empieza vacío', () => {
    expect(cart.lines).toEqual([]);
    expect(cart.count).toBe(0);
    expect(cart.total).toBe(0);
  });

  it('agrega un producto nuevo con cantidad 1', () => {
    cart.add(coffee);
    expect(cart.lines).toEqual([{ product: coffee, qty: 1 }]);
  });

  it('suma la cantidad al repetir un producto sin duplicar la línea', () => {
    cart.add(coffee);
    cart.add(burger);
    cart.add(coffee);

    expect(cart.lines.length).toBe(2);
    expect(cart.qtyOf('01')).toBe(2);
    expect(cart.count).toBe(3);
  });

  it('qtyOf devuelve 0 si el producto no está', () => {
    expect(cart.qtyOf('99')).toBe(0);
  });

  it('calcula el total sin errores de decimales', () => {
    cart.add(burger);
    cart.add(burger);
    cart.add(burger);
    expect(cart.total).toBe(30.3);
  });

  it('decrement resta una unidad y elimina la línea al llegar a 0', () => {
    cart.add(coffee);
    cart.add(coffee);

    cart.decrement('01');
    expect(cart.qtyOf('01')).toBe(1);

    cart.decrement('01');
    expect(cart.lines).toEqual([]);
  });

  it('decrement no afecta a otros productos', () => {
    cart.add(coffee);
    cart.add(burger);

    cart.decrement('01');

    expect(cart.qtyOf('05')).toBe(1);
  });

  it('remove elimina la línea completa', () => {
    cart.add(coffee);
    cart.add(coffee);
    cart.add(burger);

    cart.remove('01');

    expect(cart.lines.map((line) => line.product.id)).toEqual(['05']);
  });

  it('clear vacía el carrito', () => {
    cart.add(coffee);
    cart.clear();
    expect(cart.count).toBe(0);
  });

  it('toOrderItems prepara las líneas para el pedido', () => {
    cart.add(coffee);
    cart.add(coffee);

    expect(cart.toOrderItems()).toEqual([
      { productId: '01', product: 'Café', price: 5, qty: 2 },
    ]);
  });

  it('lines$ emite cada cambio', () => {
    const counts: number[] = [];
    cart.lines$.subscribe((lines) => counts.push(lines.length));

    cart.add(coffee);
    cart.add(burger);

    expect(counts).toEqual([0, 1, 2]);
  });
});