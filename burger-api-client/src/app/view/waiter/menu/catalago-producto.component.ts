import { Component, OnInit, Input } from '@angular/core';

import { Products } from 'src/app/modelos/products.interface';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { mapProductToCardItem } from './helpers/map-product-item.helper';
// import { mapProductToCardItem } from './helpers/map-product-item.helper';


@Component({
  selector: 'app-catalogo-producto',
  templateUrl: './catalogo-producto.component.html',
  styleUrls: ['./catalogo-producto.component.css']
})
export class CatalogoProductoComponent implements OnInit {
  @Input() product!: Products;
  // products: Products[] = [];
  filterProduc :Products[] = [];
  constructor( private readonly shoppingSvc: ShoppingCartService) { }

  ngOnInit(): void {
    //actulizar datos de verdad aquí
  }
  mostrarDesayuno = () =>  {
    this.shoppingSvc.getProducts()
    .subscribe( items => { //response
      this.filterProduc = items.filter( t => {
        return t.type === "desayuno"
      });
    });
  }
  mostrarAlmuerzo = () =>  {
    this.shoppingSvc.getProducts()
    .subscribe( items => { //response
      this.filterProduc = items.filter( t => {
        return t.type === "almuerzo"
      });
    });
  }
 addToCart(): void {
  const cartItem = mapProductToCardItem(this.product);
  this.shoppingSvc.addItem(cartItem);
 }
  // agregar(): void {
  //   const cardItem= mapProductToCardItem(this.product);
  //   this.dataSVc.addItem(cardItem);
  // }

}
