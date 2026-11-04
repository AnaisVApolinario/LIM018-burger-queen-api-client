import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Role } from '../models';
import { makeUser } from 'src/testing/factories';
import { SessionService } from '../services/session.service';
import { AuthGuard, GuestGuard } from './auth.guard';

const routeWith = (roles?: Role[]) =>
  ({ data: roles ? { roles } : {} } as unknown as ActivatedRouteSnapshot);

describe('route guards', () => {
  let session: SessionService;
  let router: Router;

  const url = (result: boolean | UrlTree): string => router.serializeUrl(result as UrlTree);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    session = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeEach(() => (guard = TestBed.inject(AuthGuard)));

    it('manda al login si no hay sesión', () => {
      expect(url(guard.canActivate(routeWith(['waiter'])))).toBe('/login');
    });

    it('deja pasar si el rol está permitido', () => {
      session.start({ token: 't', user: makeUser({ rol: 'waiter' }) });
      expect(guard.canActivate(routeWith(['waiter']))).toBeTrue();
    });

    it('deja pasar si la ruta no restringe roles', () => {
      session.start({ token: 't', user: makeUser({ rol: 'chef' }) });
      expect(guard.canActivate(routeWith())).toBeTrue();
    });

    it('redirige a la pantalla propia si el rol no corresponde', () => {
      session.start({ token: 't', user: makeUser({ rol: 'waiter' }) });
      expect(url(guard.canActivate(routeWith(['admin'])))).toBe('/waiter');
    });
  });

  describe('GuestGuard', () => {
    let guard: GuestGuard;

    beforeEach(() => (guard = TestBed.inject(GuestGuard)));

    it('permite ver el login sin sesión', () => {
      expect(guard.canActivate()).toBeTrue();
    });

    it('con sesión redirige a la pantalla del rol', () => {
      session.start({ token: 't', user: makeUser({ rol: 'chef' }) });
      expect(url(guard.canActivate())).toBe('/kitchen');
    });
  });
});