import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../services/session.service';

/**
 * Agrega `Authorization: Bearer <token>` a cada petición (excepto el login)
 * y cierra la sesión si la API responde 401 (token inválido o vencido).
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private session: SessionService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.session.token;
    const isLogin = request.url.endsWith('/auth');
    const authorized =
      token && !isLogin
        ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : request;

    return next.handle(authorized).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          this.session.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}