import { ComponentFixture, TestBed } from '@angular/core/testing';
import { makeProduct } from 'src/testing/factories';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [ProductCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    component.product = makeProduct({ name: 'Hamburguesa simple', price: 10 });
  });

  const buttons = (): HTMLButtonElement[] => Array.from(root.querySelectorAll('button'));

  it('muestra nombre, precio e imagen con texto alternativo', () => {
    fixture.detectChanges();

    expect(root.textContent).toContain('Hamburguesa simple');
    expect(root.textContent).toContain('$10.00');
    expect(root.querySelector('img')?.getAttribute('alt')).toBe('Hamburguesa simple');
  });

  it('sin imagen muestra un ícono de reemplazo', () => {
    component.product = makeProduct({ image: '' });
    fixture.detectChanges();

    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('.product-card__placeholder')).not.toBeNull();
  });

  it('el botón de quitar está deshabilitado con cantidad 0', () => {
    fixture.detectChanges();
    expect(buttons()[0].disabled).toBeTrue();
  });

  it('emite al agregar y al quitar', () => {
    component.qty = 2;
    const increase = jasmine.createSpy('increase');
    const decrease = jasmine.createSpy('decrease');
    component.increase.subscribe(increase);
    component.decrease.subscribe(decrease);
    fixture.detectChanges();

    buttons()[1].click();
    buttons()[0].click();

    expect(increase).toHaveBeenCalledTimes(1);
    expect(decrease).toHaveBeenCalledTimes(1);
    expect(root.querySelector('.stepper__qty')?.textContent).toBe('2');
  });
});