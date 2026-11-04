import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { makeOrder } from 'src/testing/factories';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const url = `${environment.api}/orders`;
  let service: OrdersService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(OrdersService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list pide los pedidos del más antiguo al más reciente', () => {
    service.list().subscribe();
    http.expectOne(`${url}?_sort=dateEntry&_order=asc`).flush([makeOrder()]);
  });

  it('list puede filtrar por estado', () => {
    service.list('ready').subscribe();
    http.expectOne(`${url}?_sort=dateEntry&_order=asc&status=ready`).flush([]);
  });

  it('create guarda el pedido', () => {
    const { id, ...order } = makeOrder();
    service.create(order).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(order);
    req.flush(makeOrder());
  });

  it('markReady cambia el estado y registra la hora de preparación', () => {
    service.markReady(1).subscribe();

    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'ready', dateProcessed: jasmine.any(String) });
    req.flush(makeOrder({ status: 'ready' }));
  });

  it('markDelivered cambia el estado y registra la hora de entrega', () => {
    service.markDelivered(1).subscribe();

    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'delivered', dateDelivered: jasmine.any(String) });
    req.flush(makeOrder({ status: 'delivered' }));
  });
});