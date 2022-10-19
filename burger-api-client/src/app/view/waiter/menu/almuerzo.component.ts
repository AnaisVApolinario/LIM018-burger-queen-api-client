import { Component, OnInit, Input } from '@angular/core';

import { Products } from 'src/app/modelos/products.interface';
import { DataService } from 'src/app/services/data.service';
import { mapProductToCardItem } from './helpers/map-product-item.helper';


@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.component.html',
  styleUrls: ['./almuerzo.component.css']
})
export class AlmuerzoComponent implements OnInit {
  @Input() product!: Products;

  products: Products[] = [];

  filterProduc :Products[] = [];
  constructor( private readonly dataSVc: DataService) { }

  ngOnInit(): void {
    //actulizar datos de verdad aquí
  }
  mostrarDesayuno = () =>  {
    this.dataSVc.getProducts()
    .subscribe( items => { //response
      this.filterProduc = items.filter( t => {
        return t.type === "desayuno"
      });
    });
  }
  mostrarAlmuerzo = () =>  {
    this.dataSVc.getProducts()
    .subscribe( items => { //response
      this.filterProduc = items.filter( t => {
        return t.type === "almuerzo"
      });
    });
  }

  agregar(): void {
    const cardItem= mapProductToCardItem(this.product);
    this.dataSVc.addItem(cardItem);
  }

}
