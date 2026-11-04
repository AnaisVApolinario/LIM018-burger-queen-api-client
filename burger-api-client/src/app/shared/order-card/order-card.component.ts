import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order } from 'src/app/core/models';
import { formatMinutes, minutesBetween } from 'src/app/core/time';

/** Minutos de espera a partir de los cuales un pedido pendiente se marca como demorado. */
export const LATE_AFTER_MINUTES = 15;

/**
 * Tarjeta de un pedido. La usan cocina (acción "Marcar listo")
 * y meseros (acción "Marcar entregado").
 */
@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
})
export class OrderCardComponent {
  @Input() order!: Order;
  @Input() actionLabel = '';
  @Input() busy = false;
  /** Instante de referencia para el tiempo de espera; el padre lo refresca al recargar. */
  @Input() now: number = Date.now();
  @Output() action = new EventEmitter<void>();

  get minutes(): number {
    return minutesBetween(this.order.dateEntry, this.order.dateProcessed ?? this.now);
  }

  get timeLabel(): string {
    const prefix = this.order.dateProcessed ? 'Preparado en' : 'Esperando';
    return `${prefix} ${formatMinutes(this.minutes)}`;
  }

  get isLate(): boolean {
    return !this.order.dateProcessed && this.minutes >= LATE_AFTER_MINUTES;
  }
}