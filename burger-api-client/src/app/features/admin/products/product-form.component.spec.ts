import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ProductsService } from 'src/app/core/services/products.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { makeProduct } from 'src/testing/factories';
import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let productsApi: jasmine.SpyObj<ProductsService>;
  let toast: jasmine.SpyObj<ToastService>;
  let navigate: jasmine.Spy;
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;
  let root: HTMLElement;

  const setup = async (id: string | null): Promise<void> => {
    productsApi = jasmine.createSpyObj<ProductsService>('ProductsService', ['get', 'create', 'update']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);
    productsApi.get.and.returnValue(
      of(makeProduct({ id: '05', name: 'Hamburguesa simple', price: 10, type: 'almuerzo', image: 'assets/simple.jpg' }))
    );

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsApi },
        { provide: ToastService, useValue: toast },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
        },
      ],
    }).compileComponents();

    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  };

  describe('crear', () => {
    beforeEach(() => setup(null));

    it('muestra el título de creación', () => {
      expect(component.isEdit).toBeFalse();
      expect(root.querySelector('h1')?.textContent).toContain('Nuevo producto');
      expect(productsApi.get).not.toHaveBeenCalled();
    });

    it('no guarda si falta el nombre o el precio es 0', () => {
      component.save();
      fixture.detectChanges();

      expect(productsApi.create).not.toHaveBeenCalled();
      expect(root.textContent).toContain('Ingresa el nombre.');
      expect(root.textContent).toContain('Ingresa un precio mayor que 0.');
    });

    it('crea el producto y vuelve a la lista', () => {
      productsApi.create.and.returnValue(of(makeProduct()));
      component.form.setValue({ name: 'Malteada', price: 12, type: 'almuerzo', image: '' });

      component.save();

      expect(productsApi.create).toHaveBeenCalledWith({
        name: 'Malteada',
        price: 12,
        type: 'almuerzo',
        image: '',
      });
      expect(toast.success).toHaveBeenCalledWith('Producto creado.');
      expect(navigate).toHaveBeenCalledWith(['/admin/products']);
    });

    it('si falla al crear avisa y no navega', () => {
      productsApi.create.and.returnValue(throwError(() => new Error('sin red')));
      component.form.setValue({ name: 'Malteada', price: 12, type: 'almuerzo', image: '' });

      component.save();

      expect(toast.error).toHaveBeenCalled();
      expect(component.saving).toBeFalse();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('editar', () => {
    beforeEach(() => setup('05'));

    it('carga los datos del producto', () => {
      expect(component.isEdit).toBeTrue();
      expect(productsApi.get).toHaveBeenCalledWith('05');
      expect(component.form.getRawValue()).toEqual({
        name: 'Hamburguesa simple',
        price: 10,
        type: 'almuerzo',
        image: 'assets/simple.jpg',
      });
      expect(root.querySelector('h1')?.textContent).toContain('Editar producto');
    });

    it('guarda los cambios y vuelve a la lista', () => {
      productsApi.update.and.returnValue(of(makeProduct()));
      component.form.patchValue({ price: 11 });

      component.save();

      expect(productsApi.update).toHaveBeenCalledWith('05', {
        name: 'Hamburguesa simple',
        price: 11,
        type: 'almuerzo',
        image: 'assets/simple.jpg',
      });
      expect(toast.success).toHaveBeenCalledWith('Cambios guardados.');
      expect(navigate).toHaveBeenCalledWith(['/admin/products']);
    });
  });

  describe('editar un producto que no existe', () => {
    beforeEach(async () => {
      await setup('99');
    });

    it('muestra el error de carga', () => {
      productsApi.get.and.returnValue(throwError(() => new Error('404')));
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.loadError).toBeTrue();
      expect(root.textContent).toContain('No se encontró el producto.');
      expect(root.querySelector('form')).toBeNull();
    });
  });
});