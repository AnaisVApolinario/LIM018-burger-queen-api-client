import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session, User } from '../models';

export const SESSION_STORAGE_KEY = 'amero.session';
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionSubject = new BehaviorSubject<Session | null>(this.restore());

  readonly session$ = this.sessionSubject.asObservable();
  readonly user$ = this.session$.pipe(map((session) => session?.user ?? null));

  get token(): string | null {
    return this.sessionSubject.value?.token ?? null;
  }

  get user(): User | null {
    return this.sessionSubject.value?.user ?? null;
  }

  start(session: Session): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Si el navegador bloquea el almacenamiento, la sesión vive solo en memoria.
    }
    this.sessionSubject.next(session);
  }

  clear(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Nada que limpiar.
    }
    this.sessionSubject.next(null);
  }

  private restore(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}