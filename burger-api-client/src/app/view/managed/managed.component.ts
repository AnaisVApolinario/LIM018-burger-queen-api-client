import { Component, OnInit } from '@angular/core';
import { empleadoService} from 'src/app/services/empleados.service'
import { ListaEmpleadosI } from 'src/app/modelos/listaEmpleados.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-managed',
  templateUrl: './managed.component.html',
  styleUrls: ['./managed.component.css']
})
export class ManagedComponent implements OnInit {

  empleados: ListaEmpleadosI[] = [];

  constructor(private api:empleadoService, private router:Router) { }

  ngOnInit(): void {
    this.api.getAllEmpleados()
      .subscribe(data=>{
        this.empleados = data;
      })
  }

  editarEmpleado(id:string){
    this.router.navigate(['managed/editar', id])
  }
  nuevoEmpleado(){
    this.router.navigate(['managed/nuevo'])
  }
}
