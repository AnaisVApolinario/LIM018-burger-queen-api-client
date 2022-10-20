import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/modelos/cartItem.interface';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  get cartItems() : CartItem[] {
    return this.shoppingCartService.items;
  } 

  get total():number {
    return this.shoppingCartService.total;
  }

  showItems = true;

  constructor(private shoppingCartService:ShoppingCartService) { }

  ngOnInit(): void {
  }

  deleteItem(itemToDelete:CartItem):void {
    this.shoppingCartService.deleteItem(itemToDelete);
  }

  toggleItemVisibility():void {
    this.showItems = !this.showItems;
  }
}
