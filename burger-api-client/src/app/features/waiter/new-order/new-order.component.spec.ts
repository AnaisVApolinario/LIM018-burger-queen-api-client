import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { SessionService } from 'src/app/core/services/session.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { makeOrder, makeProduct, makeUser } from 'src/testing/factories';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { NewOrderComponent } from './new-order.component';

describe('NewOrderComponent', () => {
  let fixture: ComponentFixture<NewOrderComponent>;
  let component: NewOrderComponent;
  let productsApi: jasmine.SpyObj<ProductsService>;
  let ordersApi: jasmine.SpyObj<OrdersService>;
  let toast: jasmine.SpyObj<ToastService>;
  let session: SessionService;
  let cart: CartService;
  let root: HTMLElement;

  const coffee = makeProduct({ id: '01', name: 'Café americano', price: 5, type: 'desayuno' });
  const burger = makeProduct({ id: '05', name: 'Hamburguesa simple', price: 10, type: 'almuerzo' });

  const names = (): string[] =>
    Array.from(root.querySelectorAll('.product-card__name')).map((n) => n.textContent ?? '');

  beforeEach(async () => {
    localStorage.clear();
    productsApi = jasmine.createSpyObj<ProductsService>('ProductsService', ['list']);
    ordersApi = jasmine.createSpyObj<OrdersService>('OrdersService', ['create']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);
    productsApi.list.and.returnValue(of([coffee, burger]));

    await TestBed.configureTestingModule({
      declarations: [NewOrderComponent, ProductCardComponent, OrderSummaryComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: productsApi },
        { provide: OrdersService, useValue: ordersApi },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();

    session = TestBed.inject(SessionService);
    session.start({ token: 't', user: makeUser({ id: '1', nombre: 'Ana Mesera' }) });
    cart = TestBed.inject(CartService);

    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('carga el menú y muestra primero el desayuno', () => {
    expect(productsApi.list).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(names()).toEqual(['Café americano']);
  });

  it('cambia de menú', () => {
    component.selectMenu('almuerzo');
    fixture.detectChanges();

    expect(names()).toEqual(['Hamburguesa simple']);
    const active = root.querySelector('.tab.is-active');
    expect(active?.textContent).toContain('Almuerzo y cena');
  });

  it('el botón de la pestaña cambia el menú', () => {
    const tabs = Array.from(root.querySelectorAll('.tab')) as HTMLButtonElement[];
    tabs[1].click();
    expect(component.menu).toBe('almuerzo');
  });

  it('avisa si un menú no tiene productos', () => {
    productsApi.list.and.returnValue(of([coffee]));
    component.loadProducts();
    component.selectMenu('almuerzo');
    fixture.detectChanges();

    expect(root.textContent).toContain('No hay productos en este menú.');
  });

  it('muestra un error si no se puede cargar y permite reintentar', () => {
    productsApi.list.and.returnValue(throwError(() => new Error('sin red')));
    component.loadProducts();
    fixture.detectChanges();

    expect(component.loadError).toBeTrue();
    expect(root.querySelector('[role="alert"]')?.textContent).toContain('No se pudo cargar el menú.');

    productsApi.list.and.returnValue(of([coffee]));
    (root.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.loadError).toBeFalse();
    expect(names()).toEqual(['Café americano']);
  });

  it('agrega productos al pedido desde la tarjeta y los muestra en el resumen', () => {
    const plus = root.querySelector('.product-card button.btn-primary') as HTMLButtonElement;
    plus.click();
    plus.click();
    fixture.detectChanges();

    expect(cart.qtyOf('01')).toBe(2);
    expect(root.querySelector('.summary__line')?.textContent).toContain('Café americano');
    expect(root.querySelector('.summary__total')?.textContent).toContain('$10.00');
  });

  it('quita productos desde la tarjeta', () => {
    cart.add(coffee);
    cart.add(coffee);
    fixture.detectChanges();

    const minus = root.querySelector('.product-card button') as HTMLButtonElement;
    minus.click();

    expect(cart.qtyOf('01')).toBe(1);
  });

  it('no permite enviar sin cliente, mesa o productos', () => {
    expect(component.canSend).toBeFalse();

    component.form.setValue({ client: 'Luis', table: '4' });
    expect(component.canSend).toBeFalse();

    cart.add(coffee);
    expect(component.canSend).toBeTrue();

    component.form.setValue({ client: 'Luis', table: '' });
    expect(component.canSend).toBeFalse();
  });

  it('envía el pedido a cocina y limpia la pantalla', () => {
    ordersApi.create.and.returnValue(of(makeOrder()));
    component.form.setValue({ client: '  Luis  ', table: ' 4 ' });
    cart.add(coffee);
    cart.add(coffee);

    component.send();

    const sent = ordersApi.create.calls.mostRecent().args[0];
    expect(sent.client).toBe('Luis');
    expect(sent.table).toBe('4');
    expect(sent.userId).toBe('1');
    expect(sent.waiterName).toBe('Ana Mesera');
    expect(sent.total).toBe(10);
    expect(sent.status).toBe('pending');
    expect(sent.products).toEqual([{ productId: '01', product: 'Café americano', price: 5, qty: 2 }]);
    expect(sent.dateProcessed).toBeNull();
    expect(sent.dateDelivered).toBeNull();

    expect(cart.count).toBe(0);
    expect(component.form.getRawValue()).toEqual({ client: '', table: '' });
    expect(component.sending).toBeFalse();
    expect(toast.success).toHaveBeenCalled();
  });

  it('si falla el envío conserva el pedido y avisa', () => {
    ordersApi.create.and.returnValue(throwError(() => new Error('sin red')));
    component.form.setValue({ client: 'Luis', table: '4' });
    cart.add(coffee);

    component.send();

    expect(cart.count).toBe(1);
    expect(component.form.getRawValue().client).toBe('Luis');
    expect(component.sending).toBeFalse();
    expect(toast.error).toHaveBeenCalled();
  });

  it('no envía si el pedido está incompleto', () => {
    component.send();
    expect(ordersApi.create).not.toHaveBeenCalled();
  });

  it('no envía si no hay sesión', () => {
    session.clear();
    component.form.setValue({ client: 'Luis', table: '4' });
    cart.add(coffee);

    component.send();

    expect(ordersApi.create).not.toHaveBeenCalled();
  });

  it('trackById usa el id del producto', () => {
    expect(component.trackById(0, coffee)).toBe('01');
  });
});