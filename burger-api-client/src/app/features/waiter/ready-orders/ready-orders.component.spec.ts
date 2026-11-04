import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Order } from 'src/app/core/models';
import { POLL_INTERVAL_MS } from 'src/app/core/polling';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { OrderCardComponent } from 'src/app/shared/order-card/order-card.component';
import { makeOrder } from 'src/testing/factories';
import { ReadyOrdersComponent } from './ready-orders.component';

describe('ReadyOrdersComponent', () => {
  let fixture: ComponentFixture<ReadyOrdersComponent>;
  let component: ReadyOrdersComponent;
  let ordersApi: jasmine.SpyObj<OrdersService>;
  let toast: jasmine.SpyObj<ToastService>;
  let root: HTMLElement;

  const ready = makeOrder({ id: 1, client: 'Luis', status: 'ready', dateProcessed: '2026-10-12T12:08:00.000Z' });

  const create = (orders$: Observable<Order[]>): void => {
    ordersApi.list.and.returnValue(orders$);
    fixture = TestBed.createComponent(ReadyOrdersComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    ordersApi = jasmine.createSpyObj<OrdersService>('OrdersService', ['list', 'markDelivered']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [ReadyOrdersComponent, OrderCardComponent],
      providers: [
        { provide: OrdersService, useValue: ordersApi },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();
  });

  it('pide solo los pedidos listos y los muestra', fakeAsync(() => {
    create(of([ready]));
    tick();
    fixture.detectChanges();

    expect(ordersApi.list).toHaveBeenCalledWith('ready');
    expect(component.loading).toBeFalse();
    expect(root.querySelectorAll('app-order-card').length).toBe(1);
    expect(root.textContent).toContain('Luis');
    fixture.destroy();
  }));

  it('indica cuando no hay pedidos listos', fakeAsync(() => {
    create(of([]));
    tick();
    fixture.detectChanges();

    expect(root.textContent).toContain('No hay pedidos listos por ahora.');
    fixture.destroy();
  }));

  it('actualiza automáticamente cada cierto tiempo', fakeAsync(() => {
    create(of([ready]));
    tick();
    expect(ordersApi.list).toHaveBeenCalledTimes(1);

    tick(POLL_INTERVAL_MS);
    expect(ordersApi.list).toHaveBeenCalledTimes(2);
    fixture.destroy();
  }));

  it('muestra un error si falla y se recupera en la siguiente ronda', fakeAsync(() => {
    create(throwError(() => new Error('sin red')));
    tick();
    fixture.detectChanges();

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(root.querySelector('[role="alert"]')).not.toBeNull();

    ordersApi.list.and.returnValue(of([ready]));
    tick(POLL_INTERVAL_MS);

    expect(component.error).toBeFalse();
    expect(component.orders.length).toBe(1);
    fixture.destroy();
  }));

  it('marcar entregado quita el pedido de la lista y avisa', fakeAsync(() => {
    ordersApi.markDelivered.and.returnValue(of(makeOrder({ status: 'delivered' })));
    create(of([ready]));
    tick();

    component.markDelivered(ready);

    expect(ordersApi.markDelivered).toHaveBeenCalledWith(1);
    expect(component.orders).toEqual([]);
    expect(component.busyId).toBeNull();
    expect(toast.success).toHaveBeenCalled();
    fixture.destroy();
  }));

  it('si falla al entregar conserva el pedido y avisa', fakeAsync(() => {
    ordersApi.markDelivered.and.returnValue(throwError(() => new Error('sin red')));
    create(of([ready]));
    tick();

    component.markDelivered(ready);

    expect(component.orders.length).toBe(1);
    expect(component.busyId).toBeNull();
    expect(toast.error).toHaveBeenCalled();
    fixture.destroy();
  }));

  it('el botón de la tarjeta entrega el pedido', fakeAsync(() => {
    ordersApi.markDelivered.and.returnValue(of(makeOrder({ status: 'delivered' })));
    create(of([ready]));
    tick();
    fixture.detectChanges();

    (root.querySelector('app-order-card button') as HTMLButtonElement).click();

    expect(ordersApi.markDelivered).toHaveBeenCalledWith(1);
    fixture.destroy();
  }));

  it('trackById usa el id del pedido', fakeAsync(() => {
    create(of([]));
    tick();
    expect(component.trackById(0, ready)).toBe(1);
    fixture.destroy();
  }));
});