import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { makeProduct } from 'src/testing/factories';
import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
  let fixture: ComponentFixture<ProductsListComponent>;
  let component: ProductsListComponent;
  let productsApi: jasmine.SpyObj<ProductsService>;
  let toast: jasmine.SpyObj<ToastService>;
  let root: HTMLElement;

  const coffee = makeProduct({ id: '01', name: 'Café americano', price: 5, type: 'desayuno' });
  const burger = makeProduct({ id: '05', name: 'Hamburguesa simple', price: 10, type: 'almuerzo', image: '' });

  const rows = (): HTMLTableRowElement[] =>
    Array.from(root.querySelectorAll('tbody tr')) as HTMLTableRowElement[];

  beforeEach(async () => {
    productsApi = jasmine.createSpyObj<ProductsService>('ProductsService', ['list', 'remove']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);
    productsApi.list.and.returnValue(of([coffee, burger]));

    await TestBed.configureTestingModule({
      declarations: [ProductsListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsApi },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('lista los productos con menú y precio', () => {
    expect(rows().length).toBe(2);
    expect(rows()[0].textContent).toContain('Café americano');
    expect(rows()[0].textContent).toContain('Desayuno');
    expect(rows()[0].textContent).toContain('$5.00');
    expect(rows()[1].textContent).toContain('Almuerzo y cena');
  });

  it('muestra la miniatura solo si el producto tiene imagen', () => {
    expect(rows()[0].querySelector('img')).not.toBeNull();
    expect(rows()[1].querySelector('img')).toBeNull();
  });

  it('cada fila tiene un enlace para editar', () => {
    expect((rows()[0].querySelector('a') as HTMLAnchorElement).getAttribute('href')).toContain(
      '/admin/products/01'
    );
  });

  it('elimina tras confirmar', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    productsApi.remove.and.returnValue(of(undefined));

    component.remove(coffee);
    fixture.detectChanges();

    expect(productsApi.remove).toHaveBeenCalledWith('01');
    expect(rows().length).toBe(1);
    expect(toast.success).toHaveBeenCalled();
  });

  it('no elimina si se cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.remove(coffee);

    expect(productsApi.remove).not.toHaveBeenCalled();
  });

  it('si falla la eliminación avisa y conserva la lista', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    productsApi.remove.and.returnValue(throwError(() => new Error('sin red')));

    component.remove(coffee);

    expect(component.products.length).toBe(2);
    expect(toast.error).toHaveBeenCalled();
  });

  it('muestra un error si no carga y permite reintentar', () => {
    productsApi.list.and.returnValue(throwError(() => new Error('sin red')));
    component.load();
    fixture.detectChanges();

    expect(root.querySelector('[role="alert"]')).not.toBeNull();

    productsApi.list.and.returnValue(of([coffee]));
    (root.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(rows().length).toBe(1);
  });

  it('trackById usa el id del producto', () => {
    expect(component.trackById(0, coffee)).toBe('01');
  });
});