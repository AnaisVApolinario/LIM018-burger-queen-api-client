import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { HOME_BY_ROLE, Role } from '../models';
import { SessionService } from '../services/session.service';

/**
 * Protege las rutas privadas.
 * - Sin sesión → /login.
 * - Con sesión pero rol no permitido (`data: { roles: [...] }`) → a su pantalla de inicio.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const user = this.session.user;
    if (!user) {
      return this.router.createUrlTree(['/login']);
    }

    const allowed = route.data['roles'] as Role[] | undefined;
    if (allowed && !allowed.includes(user.rol)) {
      return this.router.createUrlTree([HOME_BY_ROLE[user.rol]]);
    }
    return true;
  }
}

/** Evita que alguien con sesión iniciada vuelva a ver el login. */
@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.session.user;
    return user ? this.router.createUrlTree([HOME_BY_ROLE[user.rol]]) : true;
  }
}