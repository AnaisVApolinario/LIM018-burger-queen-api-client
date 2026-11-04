import { ComponentFixture, TestBed } from '@angular/core/testing';
import { makeOrder } from 'src/testing/factories';
import { OrderCardComponent } from './order-card.component';

describe('OrderCardComponent', () => {
  let fixture: ComponentFixture<OrderCardComponent>;
  let component: OrderCardComponent;
  let root: HTMLElement;

  const entry = new Date('2026-10-12T12:00:00Z').getTime();
  const minutesLater = (minutes: number): number => entry + minutes * 60000;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [OrderCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrderCardComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
  });

  const render = (): void => fixture.detectChanges();

  it('muestra cliente, mesa, mesero, productos y total', () => {
    component.order = makeOrder({ client: 'Luis', table: '7' });
    render();

    const text = root.textContent ?? '';
    expect(text).toContain('Luis');
    expect(text).toContain('Mesa 7');
    expect(text).toContain('Ana Mesera');
    expect(text).toContain('2× Café americano');
    expect(text).toContain('$10.00');
  });

  it('un pedido pendiente muestra cuánto lleva esperando', () => {
    component.order = makeOrder();
    component.now = minutesLater(5);
    render();

    expect(component.timeLabel).toBe('Esperando 5 min');
    expect(component.isLate).toBeFalse();
    expect(root.querySelector('.is-late')).toBeNull();
  });

  it('marca como demorado un pendiente que pasó el límite', () => {
    component.order = makeOrder();
    component.now = minutesLater(15);
    render();

    expect(component.isLate).toBeTrue();
    expect(root.querySelector('.order-card')?.classList).toContain('is-late');
  });

  it('un pedido preparado muestra cuánto tardó, aunque haya pasado mucho tiempo', () => {
    component.order = makeOrder({
      status: 'ready',
      dateProcessed: new Date(minutesLater(8)).toISOString(),
    });
    component.now = minutesLater(120);
    render();

    expect(component.timeLabel).toBe('Preparado en 8 min');
    expect(component.isLate).toBeFalse();
  });

  it('sin actionLabel no muestra botón', () => {
    component.order = makeOrder();
    render();
    expect(root.querySelector('button')).toBeNull();
  });

  it('con actionLabel muestra el botón y emite la acción', () => {
    component.order = makeOrder();
    component.actionLabel = 'Marcar listo';
    const emitted = jasmine.createSpy('action');
    component.action.subscribe(emitted);
    render();

    const button = root.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Marcar listo');
    button.click();

    expect(emitted).toHaveBeenCalled();
  });

  it('deshabilita el botón mientras está ocupado', () => {
    component.order = makeOrder();
    component.actionLabel = 'Marcar listo';
    component.busy = true;
    render();

    expect((root.querySelector('button') as HTMLButtonElement).disabled).toBeTrue();
  });
});