import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { poll } from './polling';

describe('poll', () => {
  it('pide de inmediato y luego repite cada intervalo', fakeAsync(() => {
    let calls = 0;
    const received: number[] = [];

    const subscription = poll(() => {
      calls++;
      return of(calls);
    }, 100).subscribe((value) => received.push(value));

    tick(0);
    expect(received).toEqual([1]);

    tick(100);
    expect(received).toEqual([1, 2]);

    tick(100);
    expect(received).toEqual([1, 2, 3]);

    subscription.unsubscribe();
  }));

  it('deja de pedir al cancelar la suscripción', fakeAsync(() => {
    let calls = 0;
    const subscription = poll(() => {
      calls++;
      return of(calls);
    }, 100).subscribe();

    tick(0);
    subscription.unsubscribe();
    tick(500);

    expect(calls).toBe(1);
  }));
});