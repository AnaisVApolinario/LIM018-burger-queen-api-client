import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router'
import { empleadoService } from 'src/app/services/empleados.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  constructor(private activeroute:ActivatedRoute, private router:Router, private empleadoSvc:empleadoService) { }

  ngOnInit(): void {
    let empleadoid = this.activeroute.snapshot.paramMap.get('id');
    // let token = this.getToken();
    this.empleadoSvc.getSingleEmpleado(empleadoid).subscribe(data => {
      console.log(data)
    })
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
