import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { makeUser } from 'src/testing/factories';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

describe('AuthService', () => {
  let auth: AuthService;
  let session: SessionService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule, RouterTestingModule] });
    auth = TestBed.inject(AuthService);
    session = TestBed.inject(SessionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('login envía las credenciales y guarda la sesión', () => {
    const response = { token: 'tok', user: makeUser() };
    let result: unknown;

    auth.login({ email: 'ana@amero.com', password: '123456' }).subscribe((r) => (result = r));

    const req = http.expectOne(`${environment.api}/auth`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'ana@amero.com', password: '123456' });
    req.flush(response);

    expect(result).toEqual(response);
    expect(session.token).toBe('tok');
    expect(session.user).toEqual(response.user);
  });

  it('no guarda sesión si el login falla', () => {
    auth.login({ email: 'x@x.com', password: 'mala' }).subscribe({ error: () => undefined });

    http
      .expectOne(`${environment.api}/auth`)
      .flush({ message: 'Credenciales inválidas' }, { status: 400, statusText: 'Bad Request' });

    expect(session.token).toBeNull();
  });

  it('logout limpia la sesión y vuelve al login', () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    session.start({ token: 'tok', user: makeUser() });

    auth.logout();

    expect(session.token).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});