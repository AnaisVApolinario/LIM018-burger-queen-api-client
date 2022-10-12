import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaPedidosComponent } from './caja-pedidos.component';

describe('CajaPedidosComponent', () => {
  let component: CajaPedidosComponent;
  let fixture: ComponentFixture<CajaPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CajaPedidosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
