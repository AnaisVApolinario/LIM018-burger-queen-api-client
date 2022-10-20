import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/modelos/cartItem.interface';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [{
    name: 'Cafe Americano',
    price: 8,
  },{
    name: 'Queso',
    price: 5,
  }];
  get total():number {
    return this.cartItems.reduce((acc,{price}) => acc +=price, 0)
  }

  constructor() { }

  ngOnInit(): void {
  }
  deleteItem(itemToDelete:CartItem): void {
    this.cartItems = this.cartItems.filter(
      (item) => item !== itemToDelete
    )
  }
}
