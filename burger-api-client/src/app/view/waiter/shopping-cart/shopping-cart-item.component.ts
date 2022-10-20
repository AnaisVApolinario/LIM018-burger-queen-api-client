import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartItem } from 'src/app/modelos/cartItem.interface';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css']
})
export class ShoppingCartItemComponent implements OnInit {
  @Input() cartItem: CartItem | undefined;
  @Output() cartItemDelete = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }
  onDeleteClick(): void {
    this.cartItemDelete.emit();
  }
}
