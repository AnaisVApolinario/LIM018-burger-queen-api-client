import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/core/models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() qty = 0;
  @Output() increase = new EventEmitter<void>();
  @Output() decrease = new EventEmitter<void>();
}