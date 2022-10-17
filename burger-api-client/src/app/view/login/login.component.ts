import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api';
import { LoginI } from 'src/app/modelos/login.interface';
import { ResponseI } from 'src/app/modelos/response.interface';

import { Router } from '@angular/router';

const baseUrl: string = "http://localhost:3000";

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

  constructor(private api: ApiService, private router:Router) { }

  errorStatus: boolean = true;
  errorMsj:string = '';
  errorcode:string = '';
  ngOnInit(): void {

  }

  onLogin(form: LoginI) {
    this.api.loginByEmail(form).subscribe(data => {
      let dataResponse:ResponseI = data;

      console.log(dataResponse)
      if (dataResponse) {
        
        localStorage.setItem("token",dataResponse.token);
        this.router.navigate(['/waiter']); 
        
      }else{
      if (this.errorcode == 'auth/missing-email'){
          this.errorStatus = true
          this.errorMsj = 'Debe ingresar un usuario y contraseña'
        }
      }
      console.log('adios')
    })

  }
}




  
