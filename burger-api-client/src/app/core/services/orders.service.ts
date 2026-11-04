import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewOrder, Order, OrderStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly url = `${environment.api}/orders`;

  constructor(private http: HttpClient) {}

  /** Pedidos en orden de llegada (el más antiguo primero), opcionalmente filtrados por estado. */
  list(status?: OrderStatus): Observable<Order[]> {
    let params = new HttpParams().set('_sort', 'dateEntry').set('_order', 'asc');
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Order[]>(this.url, { params });
  }

  create(order: NewOrder): Observable<Order> {
    return this.http.post<Order>(this.url, order);
  }

  markReady(id: Order['id']): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${id}`, {
      status: 'ready',
      dateProcessed: new Date().toISOString(),
    });
  }

  markDelivered(id: Order['id']): Observable<Order> {
    return this.http.patch<Order>(`${this.url}/${id}`, {
      status: 'delivered',
      dateDelivered: new Date().toISOString(),
    });
  }
}