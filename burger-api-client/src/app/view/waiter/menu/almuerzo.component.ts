import { Component, OnInit } from '@angular/core';
import { Products, DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.component.html',
  styleUrls: ['./almuerzo.component.css']
})
export class AlmuerzoComponent implements OnInit {
  products: Products[] = [];
  seleccionDeTipo: String = ' ';
  asignarTipoComida = (tipo: String ) => {
    const tipoComida: String = tipo.toLowerCase().trim();
    return tipoComida === "almuerzo" ? "almuerzo" : "desayuno";
  }


  constructor( private dataSVc: DataService, private router:Router) { }
  // ngOnInit(): void {
    //   this.dataSVc.asignarTipoComida()
    //     .subscribe(data=>{
      //       this.empleados = data[0];
      //     })
      // }
      ngOnInit(): void {
        //actulizar datos de verdad aquí
        this.dataSVc.getProducts()
        .subscribe( items => { //response´
          // console.log(items.type)
          mostrarOcultar= () => {

          }
      this.products = [...items]
      let filteredProducts = this.products;
    //   if (this.productTypeSelected !== 'all') {
    //     filteredProducts = items.filter(p => p.type === this.productTypeSelected)
    //   }
    //   this.filteredProducts = filteredProducts;
    // });
  })
}
}
