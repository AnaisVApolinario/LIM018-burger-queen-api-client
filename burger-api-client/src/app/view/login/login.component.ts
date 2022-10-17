import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { LoginI } from 'src/app/modelos/login.interface';
import { ResponseI } from 'src/app/modelos/response.interface';

import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private api: DataService, private router: Router) { }

  errorStatus: boolean = false;
  errorMsj: string = '';
  errorcode: string = '';
  ngOnInit(): void {

  }

  onLogin(form: LoginI) {
    this.api.loginByEmail(form).subscribe(data => {
      console.log('solo data', data)
      let dataResponse: ResponseI = data;

      console.log('data', dataResponse)
      if (dataResponse.status == "ok") {
console.log('status',dataResponse.status)
        localStorage.setItem("token", dataResponse.result.token);
        this.router.navigate(['waiter']);

      } else {

        if (this.errorcode == 'auth/missing-email') {
          this.errorStatus = true
          this.errorMsj = 'Debe ingresar un usuario y contraseña'
        }
      
      }
      console.log('adios')
    })

  }
}



