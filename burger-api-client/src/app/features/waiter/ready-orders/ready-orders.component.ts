import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from 'src/app/core/models';
import { poll } from 'src/app/core/polling';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-ready-orders',
  templateUrl: './ready-orders.component.html',
})
export class ReadyOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  error = false;
  busyId: Order['id'] | null = null;
  now = Date.now();

  private subscription?: Subscription;

  constructor(private ordersApi: OrdersService, private toast: ToastService) {}

  ngOnInit(): void {
    this.subscription = poll(() =>
      this.ordersApi.list('ready').pipe(
        catchError(() => {
          this.loading = false;
          this.error = true;
          return EMPTY;
        })
      )
    ).subscribe((orders) => {
      this.orders = orders;
      this.now = Date.now();
      this.loading = false;
      this.error = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  trackById(_index: number, order: Order): Order['id'] {
    return order.id;
  }

  markDelivered(order: Order): void {
    this.busyId = order.id;
    this.ordersApi.markDelivered(order.id).subscribe({
      next: () => {
        this.busyId = null;
        this.orders = this.orders.filter((item) => item.id !== order.id);
        this.toast.success(`Pedido de ${order.client} entregado.`);
      },
      error: () => {
        this.busyId = null;
        this.toast.error('No se pudo marcar el pedido como entregado.');
      },
    });
  }
}