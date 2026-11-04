import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from 'src/app/core/models';
import { poll } from 'src/app/core/polling';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ToastService } from 'src/app/core/services/toast.service';

export type KitchenView = 'pending' | 'done';

/** Cantidad de pedidos ya preparados que se muestran en la pestaña "Preparados". */
export const DONE_LIMIT = 12;

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
})
export class KitchenComponent implements OnInit, OnDestroy {
  view: KitchenView = 'pending';
  pending: Order[] = [];
  done: Order[] = [];
  loading = true;
  error = false;
  busyId: Order['id'] | null = null;
  now = Date.now();

  private orders: Order[] = [];
  private subscription?: Subscription;

  constructor(private ordersApi: OrdersService, private toast: ToastService) {}

  ngOnInit(): void {
    this.subscription = poll(() =>
      this.ordersApi.list().pipe(
        catchError(() => {
          this.loading = false;
          this.error = true;
          return EMPTY;
        })
      )
    ).subscribe((orders) => this.apply(orders));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  select(view: KitchenView): void {
    this.view = view;
  }

  trackById(_index: number, order: Order): Order['id'] {
    return order.id;
  }

  markReady(order: Order): void {
    this.busyId = order.id;
    this.ordersApi.markReady(order.id).subscribe({
      next: (updated) => {
        this.busyId = null;
        this.apply(this.orders.map((item) => (item.id === updated.id ? updated : item)));
        this.toast.success(`Pedido de ${order.client} listo para servir.`);
      },
      error: () => {
        this.busyId = null;
        this.toast.error('No se pudo marcar el pedido como listo.');
      },
    });
  }

  private apply(orders: Order[]): void {
    this.orders = orders;
    this.pending = orders.filter((order) => order.status === 'pending');
    this.done = orders
      .filter((order) => order.status !== 'pending')
      .sort((a, b) => (b.dateProcessed ?? '').localeCompare(a.dateProcessed ?? ''))
      .slice(0, DONE_LIMIT);
    this.now = Date.now();
    this.loading = false;
    this.error = false;
  }
}