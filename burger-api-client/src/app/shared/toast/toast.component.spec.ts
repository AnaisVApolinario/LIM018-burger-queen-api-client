import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ToastService } from 'src/app/core/services/toast.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [ToastComponent] }).compileComponents();
    service = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(ToastComponent);
    root = fixture.nativeElement;
  });

  it('muestra los avisos con el rol adecuado', fakeAsync(() => {
    service.success('Guardado');
    service.error('Falló');
    fixture.detectChanges();

    const toasts = Array.from(root.querySelectorAll('.toast'));
    expect(toasts.map((t) => t.textContent)).toEqual([
      jasmine.stringMatching('Guardado'),
      jasmine.stringMatching('Falló'),
    ]);
    expect(toasts[0].getAttribute('role')).toBe('status');
    expect(toasts[1].getAttribute('role')).toBe('alert');
    expect(toasts[1].classList).toContain('toast--error');
    flush();
  }));

  it('el botón cerrar quita el aviso', fakeAsync(() => {
    service.success('Guardado');
    fixture.detectChanges();

    (root.querySelector('.toast__close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(root.querySelectorAll('.toast').length).toBe(0);
    flush();
  }));
});