import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedComponent } from './managed.component';

describe('ManagedComponent', () => {
  let component: ManagedComponent;
  let fixture: ComponentFixture<ManagedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
