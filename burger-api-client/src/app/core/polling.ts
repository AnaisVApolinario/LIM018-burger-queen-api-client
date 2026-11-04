import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const POLL_INTERVAL_MS = 10000;
export function poll<T>(
  request: () => Observable<T>,
  everyMs: number = POLL_INTERVAL_MS
): Observable<T> {
  return timer(0, everyMs).pipe(switchMap(() => request()));
}