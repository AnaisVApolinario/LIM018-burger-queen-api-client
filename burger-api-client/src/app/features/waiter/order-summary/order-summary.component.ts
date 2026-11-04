import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartLine, Product } from 'src/app/core/models';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent {
  @Input() lines: CartLine[] = [];
  @Input() total = 0;
  @Input() canSend = false;
  @Input() sending = false;

  @Output() increase = new EventEmitter<Product>();
  @Output() decrease = new EventEmitter<Product['id']>();
  @Output() remove = new EventEmitter<Product['id']>();
  @Output() confirm = new EventEmitter<void>();

  trackByLine(_index: number, line: CartLine): Product['id'] {
    return line.product.id;
  }
}