import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartLine, OrderItem, Product } from '../models';

const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Estado del pedido en curso. Vive en un servicio para que no se pierda al cambiar de pestaña:
 * los clientes cambian de opinión muchas veces antes de confirmar.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly linesSubject = new BehaviorSubject<CartLine[]>([]);

  readonly lines$ = this.linesSubject.asObservable();

  get lines(): CartLine[] {
    return this.linesSubject.value;
  }

  get count(): number {
    return this.lines.reduce((sum, line) => sum + line.qty, 0);
  }

  get total(): number {
    return round2(this.lines.reduce((sum, line) => sum + line.product.price * line.qty, 0));
  }

  qtyOf(productId: Product['id']): number {
    return this.lines.find((line) => line.product.id === productId)?.qty ?? 0;
  }

  add(product: Product): void {
    const exists = this.lines.some((line) => line.product.id === product.id);
    this.linesSubject.next(
      exists
        ? this.lines.map((line) =>
            line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line
          )
        : [...this.lines, { product, qty: 1 }]
    );
  }

  decrement(productId: Product['id']): void {
    this.linesSubject.next(
      this.lines
        .map((line) => (line.product.id === productId ? { ...line, qty: line.qty - 1 } : line))
        .filter((line) => line.qty > 0)
    );
  }

  remove(productId: Product['id']): void {
    this.linesSubject.next(this.lines.filter((line) => line.product.id !== productId));
  }

  clear(): void {
    this.linesSubject.next([]);
  }

  toOrderItems(): OrderItem[] {
    return this.lines.map(({ product, qty }) => ({
      productId: product.id,
      product: product.name,
      price: product.price,
      qty,
    }));
  }
}