import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Credentials, Session } from '../models';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private session: SessionService,
    private router: Router
  ) {}

  login(credentials: Credentials): Observable<Session> {
    return this.http
      .post<Session>(`${environment.api}/auth`, credentials)
      .pipe(tap((session) => this.session.start(session)));
  }

  logout(): void {
    this.session.clear();
    this.router.navigate(['/login']);
  }
}