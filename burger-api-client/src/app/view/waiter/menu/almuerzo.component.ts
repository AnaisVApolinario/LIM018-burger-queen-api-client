import { Component, OnInit } from '@angular/core';
import { Products, DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.component.html',
  styleUrls: ['./almuerzo.component.css']
})
export class AlmuerzoComponent implements OnInit {
  products: Products[] = [];
  filterProduc :Products[] = [];
  constructor( private readonly dataSVc: DataService) { }

  ngOnInit(): void {
    //actulizar datos de verdad aquí
    this.dataSVc.getProducts()
    .subscribe( items => { //response
      // this.products = [...items];
      this.filterProduc = items.filter( t => {
        return t.type === "almuerzo"
      });
    });
  }

}
