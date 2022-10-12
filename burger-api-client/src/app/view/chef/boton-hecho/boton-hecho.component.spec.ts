import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonHechoComponent } from './boton-hecho.component';

describe('BotonHechoComponent', () => {
  let component: BotonHechoComponent;
  let fixture: ComponentFixture<BotonHechoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotonHechoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonHechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
