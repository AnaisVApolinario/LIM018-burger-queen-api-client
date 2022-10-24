import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { EmpleadoI } from 'src/app/modelos/empleado.interface';
import { empleadoService } from 'src/app/services/empleados.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  constructor(private activeroute: ActivatedRoute, private router: Router, private empleadoSvc: empleadoService) { }

  datosEmpleado!: EmpleadoI;
  editarForm = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
    empleadoId: new FormControl(''),
    password: new FormControl(''),
    rol: new FormControl(''),

  });



  ngOnInit(): void {
    let empleadoid = this.activeroute.snapshot.paramMap.get('id');
    // let token = this.getToken();
    this.empleadoSvc.getSingleEmpleado(empleadoid).subscribe((data:any)=> {
      this.datosEmpleado = data[0];
      console.log(data)
      this.editarForm.setValue({
        'nombre': this.datosEmpleado.nombre,
        'email': this.datosEmpleado.email,
        'empleadoId': this.datosEmpleado.id,
        'password': this.datosEmpleado.password,
        'rol': this.datosEmpleado.rol,
      });
      console.log(this.editarForm.value)
    })
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
