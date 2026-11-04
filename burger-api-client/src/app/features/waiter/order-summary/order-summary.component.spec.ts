import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartLine } from 'src/app/core/models';
import { makeProduct } from 'src/testing/factories';
import { OrderSummaryComponent } from './order-summary.component';

describe('OrderSummaryComponent', () => {
  let fixture: ComponentFixture<OrderSummaryComponent>;
  let component: OrderSummaryComponent;
  let root: HTMLElement;

  const coffee = makeProduct({ id: '01', name: 'Café americano', price: 5 });
  const lines: CartLine[] = [{ product: coffee, qty: 3 }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [OrderSummaryComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrderSummaryComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
  });

  const sendButton = (): HTMLButtonElement =>
    root.querySelector('.summary > button.btn-primary') as HTMLButtonElement;

  it('sin productos lo indica, muestra total 0 y bloquea el envío', () => {
    fixture.detectChanges();

    expect(root.textContent).toContain('Aún no agregaste productos.');
    expect(root.querySelector('.summary__total')?.textContent).toContain('$0.00');
    expect(sendButton().disabled).toBeTrue();
    expect(root.querySelector('.hint')).not.toBeNull();
  });

  it('muestra cada línea con su subtotal y el total', () => {
    component.lines = lines;
    component.total = 15;
    fixture.detectChanges();

    expect(root.querySelector('.summary__line')?.textContent).toContain('Café americano');
    expect(root.querySelector('.summary__price')?.textContent).toContain('$15.00');
    expect(root.querySelector('.summary__total')?.textContent).toContain('$15.00');
  });

  it('emite los eventos de cada botón de la línea', () => {
    component.lines = lines;
    const increase = jasmine.createSpy('increase');
    const decrease = jasmine.createSpy('decrease');
    const remove = jasmine.createSpy('remove');
    component.increase.subscribe(increase);
    component.decrease.subscribe(decrease);
    component.remove.subscribe(remove);
    fixture.detectChanges();

    const [minus, plus, del] = Array.from(root.querySelectorAll('.summary__line button')) as HTMLButtonElement[];
    minus.click();
    plus.click();
    del.click();

    expect(decrease).toHaveBeenCalledWith('01');
    expect(increase).toHaveBeenCalledWith(coffee);
    expect(remove).toHaveBeenCalledWith('01');
  });

  it('cuando se puede enviar, el botón emite confirm', () => {
    component.lines = lines;
    component.canSend = true;
    const confirm = jasmine.createSpy('confirm');
    component.confirm.subscribe(confirm);
    fixture.detectChanges();

    expect(sendButton().disabled).toBeFalse();
    expect(root.querySelector('.hint')).toBeNull();
    sendButton().click();

    expect(confirm).toHaveBeenCalled();
  });

  it('mientras envía cambia el texto y no muestra la ayuda', () => {
    component.lines = lines;
    component.sending = true;
    fixture.detectChanges();

    expect(sendButton().textContent).toContain('Enviando…');
    expect(root.querySelector('.hint')).toBeNull();
  });

  it('trackByLine usa el id del producto', () => {
    expect(component.trackByLine(0, lines[0])).toBe('01');
  });
});