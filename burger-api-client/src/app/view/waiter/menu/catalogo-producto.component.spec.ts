import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoProductoComponent } from './catalago-producto.component';

describe('CatalogoProductoComponent', () => {
  let component: CatalogoProductoComponent;
  let fixture: ComponentFixture<CatalogoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
