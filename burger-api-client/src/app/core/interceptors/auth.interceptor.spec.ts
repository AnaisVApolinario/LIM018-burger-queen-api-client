import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { makeUser } from 'src/testing/factories';
import { SessionService } from '../services/session.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let session: SessionService;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('agrega el token a las peticiones cuando hay sesión', () => {
    session.start({ token: 'tok', user: makeUser() });

    http.get('/products').subscribe();

    const req = controller.expectOne('/products');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok');
    req.flush([]);
  });

  it('no agrega token sin sesión', () => {
    http.get('/products').subscribe();

    const req = controller.expectOne('/products');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('no agrega token a la petición de login', () => {
    session.start({ token: 'tok', user: makeUser() });

    http.post('http://localhost:3000/auth', {}).subscribe();

    const req = controller.expectOne('http://localhost:3000/auth');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('cierra la sesión y vuelve al login ante un 401', () => {
    session.start({ token: 'tok', user: makeUser() });
    let failed = false;

    http.get('/orders').subscribe({ error: () => (failed = true) });
    controller.expectOne('/orders').flush('', { status: 401, statusText: 'Unauthorized' });

    expect(failed).toBeTrue();
    expect(session.token).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('no toca la sesión ante otros errores', () => {
    session.start({ token: 'tok', user: makeUser() });

    http.get('/orders').subscribe({ error: () => undefined });
    controller.expectOne('/orders').flush('', { status: 500, statusText: 'Server Error' });

    expect(session.token).toBe('tok');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('un 401 sin sesión no redirige (por ejemplo, credenciales malas en el login)', () => {
    http.get('/orders').subscribe({ error: () => undefined });
    controller.expectOne('/orders').flush('', { status: 401, statusText: 'Unauthorized' });

    expect(navigate).not.toHaveBeenCalled();
  });
});