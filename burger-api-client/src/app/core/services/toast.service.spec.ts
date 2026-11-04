import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Toast, TOAST_DURATION_MS, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let current: Toast[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    current = [];
    service.toasts$.subscribe((toasts) => (current = toasts));
  });

  it('success agrega un aviso de éxito', fakeAsync(() => {
    service.success('Guardado');
    expect(current.length).toBe(1);
    expect(current[0].kind).toBe('success');
    expect(current[0].text).toBe('Guardado');
    flush();
  }));

  it('error agrega un aviso de error', fakeAsync(() => {
    service.error('Falló');
    expect(current[0].kind).toBe('error');
    flush();
  }));

  it('cada aviso tiene un id distinto', fakeAsync(() => {
    service.success('Uno');
    service.success('Dos');
    expect(current[0].id).not.toBe(current[1].id);
    flush();
  }));

  it('el aviso desaparece solo pasado el tiempo', fakeAsync(() => {
    service.success('Guardado');

    tick(TOAST_DURATION_MS - 1);
    expect(current.length).toBe(1);

    tick(1);
    expect(current.length).toBe(0);
  }));

  it('dismiss quita solo el aviso indicado', fakeAsync(() => {
    service.success('Uno');
    service.success('Dos');

    service.dismiss(current[0].id);

    expect(current.map((toast) => toast.text)).toEqual(['Dos']);
    flush();
  }));
});