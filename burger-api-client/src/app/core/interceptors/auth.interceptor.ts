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
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private session: SessionService,
    private router: Router,
    private toast: ToastService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
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
          this.toast.error('Tu sesión expiró. Ingresa de nuevo.');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
    );
  }
}
