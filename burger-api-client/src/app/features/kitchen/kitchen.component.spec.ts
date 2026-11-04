import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Order } from 'src/app/core/models';
import { POLL_INTERVAL_MS } from 'src/app/core/polling';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { OrderCardComponent } from 'src/app/shared/order-card/order-card.component';
import { makeOrder } from 'src/testing/factories';
import { DONE_LIMIT, KitchenComponent } from './kitchen.component';

describe('KitchenComponent', () => {
  let fixture: ComponentFixture<KitchenComponent>;
  let component: KitchenComponent;
  let ordersApi: jasmine.SpyObj<OrdersService>;
  let toast: jasmine.SpyObj<ToastService>;
  let root: HTMLElement;

  const pending = makeOrder({ id: 1, client: 'Luis' });
  const done = makeOrder({
    id: 2,
    client: 'Marta',
    status: 'ready',
    dateProcessed: '2026-10-12T12:09:00.000Z',
  });

  const create = (orders$: Observable<Order[]>): void => {
    ordersApi.list.and.returnValue(orders$);
    fixture = TestBed.createComponent(KitchenComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    ordersApi = jasmine.createSpyObj<OrdersService>('OrdersService', ['list', 'markReady']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [KitchenComponent, OrderCardComponent],
      providers: [
        { provide: OrdersService, useValue: ordersApi },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();
  });

  it('separa pendientes y preparados', fakeAsync(() => {
    create(of([pending, done]));
    tick();
    fixture.detectChanges();

    expect(component.pending).toEqual([pending]);
    expect(component.done).toEqual([done]);
    expect(component.loading).toBeFalse();

    const tabs = Array.from(root.querySelectorAll('.tab')).map((t) => t.textContent?.trim());
    expect(tabs).toEqual(['Pendientes (1)', 'Preparados (1)']);
    fixture.destroy();
  }));

  it('muestra primero los pendientes y permite ver los preparados con su tiempo', fakeAsync(() => {
    create(of([pending, done]));
    tick();
    fixture.detectChanges();

    expect(root.textContent).toContain('Luis');
    expect(root.textContent).not.toContain('Marta');

    (root.querySelectorAll('.tab')[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.view).toBe('done');
    expect(root.textContent).toContain('Marta');
    expect(root.textContent).toContain('Preparado en 9 min');
    expect(root.querySelector('app-order-card button')).toBeNull();
    fixture.destroy();
  }));

  it('mensajes de lista vacía en cada pestaña', fakeAsync(() => {
    create(of([]));
    tick();
    fixture.detectChanges();
    expect(root.textContent).toContain('No hay pedidos pendientes.');

    component.select('done');
    fixture.detectChanges();
    expect(root.textContent).toContain('Todavía no hay pedidos preparados.');
    fixture.destroy();
  }));

  it('en preparados muestra solo los más recientes, del último al primero', fakeAsync(() => {
    const many = Array.from({ length: DONE_LIMIT + 3 }, (_, i) =>
      makeOrder({
        id: i + 10,
        status: 'ready',
        dateProcessed: new Date(Date.UTC(2026, 9, 12, 12, i)).toISOString(),
      })
    );
    create(of(many));
    tick();

    expect(component.done.length).toBe(DONE_LIMIT);
    expect(component.done[0].id).toBe(many[many.length - 1].id);
    fixture.destroy();
  }));

  it('ordena aunque falte la fecha de preparación', fakeAsync(() => {
    const noDate = makeOrder({ id: 20, status: 'delivered', dateProcessed: null });
    create(of([noDate, done]));
    tick();

    expect(component.done.map((o) => o.id)).toEqual([2, 20]);
    fixture.destroy();
  }));

  it('actualiza automáticamente', fakeAsync(() => {
    create(of([pending]));
    tick();
    tick(POLL_INTERVAL_MS);

    expect(ordersApi.list).toHaveBeenCalledTimes(2);
    fixture.destroy();
  }));

  it('muestra un error si falla y se recupera después', fakeAsync(() => {
    create(throwError(() => new Error('sin red')));
    tick();
    fixture.detectChanges();

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(root.querySelector('[role="alert"]')).not.toBeNull();

    ordersApi.list.and.returnValue(of([pending]));
    tick(POLL_INTERVAL_MS);

    expect(component.error).toBeFalse();
    expect(component.pending.length).toBe(1);
    fixture.destroy();
  }));

  it('marcar listo mueve el pedido a preparados y avisa', fakeAsync(() => {
    const updated = { ...pending, status: 'ready' as const, dateProcessed: '2026-10-12T12:07:00.000Z' };
    ordersApi.markReady.and.returnValue(of(updated));
    create(of([pending, done]));
    tick();

    component.markReady(pending);

    expect(ordersApi.markReady).toHaveBeenCalledWith(1);
    expect(component.pending).toEqual([]);
    expect(component.done.map((o) => o.id)).toEqual([2, 1]);
    expect(component.busyId).toBeNull();
    expect(toast.success).toHaveBeenCalled();
    fixture.destroy();
  }));

  it('si falla al marcar listo conserva el pedido y avisa', fakeAsync(() => {
    ordersApi.markReady.and.returnValue(throwError(() => new Error('sin red')));
    create(of([pending]));
    tick();

    component.markReady(pending);

    expect(component.pending.length).toBe(1);
    expect(component.busyId).toBeNull();
    expect(toast.error).toHaveBeenCalled();
    fixture.destroy();
  }));

  it('el botón de la tarjeta marca el pedido como listo', fakeAsync(() => {
    ordersApi.markReady.and.returnValue(of({ ...pending, status: 'ready' as const }));
    create(of([pending]));
    tick();
    fixture.detectChanges();

    (root.querySelector('app-order-card button') as HTMLButtonElement).click();

    expect(ordersApi.markReady).toHaveBeenCalledWith(1);
    fixture.destroy();
  }));

  it('trackById usa el id del pedido', fakeAsync(() => {
    create(of([]));
    tick();
    expect(component.trackById(0, pending)).toBe(1);
    fixture.destroy();
  }));
});