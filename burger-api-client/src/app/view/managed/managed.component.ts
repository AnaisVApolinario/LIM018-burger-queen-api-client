import { Component, OnInit } from '@angular/core';
import { DataService, ListaEmpleadosI } from 'src/app/services/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-managed',
  templateUrl: './managed.component.html',
  styleUrls: ['./managed.component.css']
})
export class ManagedComponent implements OnInit {

  empleados: ListaEmpleadosI[] = [];

  constructor(private api:DataService, private router:Router) { }

  ngOnInit(): void {
    this.api.getAllEmpleados()
      .subscribe(data=>{
        this.empleados = data;
      })
  }

}
