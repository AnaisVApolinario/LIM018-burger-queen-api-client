import { TestBed } from '@angular/core/testing';
import { Session } from '../models';
import { SESSION_STORAGE_KEY, SessionService } from './session.service';

const session: Session = {
  token: 'abc',
  user: { id: '1', nombre: 'Ana', email: 'ana@amero.com', rol: 'waiter' },
};

describe('SessionService', () => {
  const create = (): SessionService => {
    TestBed.configureTestingModule({});
    return TestBed.inject(SessionService);
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('empieza sin sesión', () => {
    const service = create();
    expect(service.token).toBeNull();
    expect(service.user).toBeNull();
  });

  it('start guarda la sesión y la expone', () => {
    const service = create();
    let current: unknown = 'sin-valor';
    service.user$.subscribe((user) => (current = user));

    service.start(session);

    expect(service.token).toBe('abc');
    expect(service.user).toEqual(session.user);
    expect(current).toEqual(session.user);
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBe(JSON.stringify(session));
  });

  it('restaura la sesión guardada al crearse', () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    expect(create().token).toBe('abc');
  });

  it('ignora datos corruptos en el almacenamiento', () => {
    localStorage.setItem(SESSION_STORAGE_KEY, '{no es json');
    expect(create().token).toBeNull();
  });

  it('clear borra la sesión', () => {
    const service = create();
    service.start(session);

    service.clear();

    expect(service.token).toBeNull();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('sigue funcionando en memoria si el almacenamiento falla', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('bloqueado');
    spyOn(Storage.prototype, 'setItem').and.throwError('bloqueado');
    spyOn(Storage.prototype, 'removeItem').and.throwError('bloqueado');

    const service = create();
    expect(service.token).toBeNull();

    service.start(session);
    expect(service.token).toBe('abc');

    service.clear();
    expect(service.token).toBeNull();
  });
});