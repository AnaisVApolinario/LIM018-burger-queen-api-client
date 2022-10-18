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

  // token:string;

  ngOnInit(): void {
    // let token = localStorage.getItem('token');
    // this.loginForm.
  }
  onLogin(form: LoginI) {
    console.log(this.api.loginByEmail(form));
    this.api.loginByEmail(form).subscribe(data => {
      let dataResponse:ResponseI = data;
      console.log(dataResponse)
      if(dataResponse.status == "ok") {
        localStorage.setItem("token", dataResponse.result.token);
        this.router.navigate(['waiter']);
      }else{
        this.errorStatus = true;
        this.errorMsj = dataResponse.result.error_msg;
        ;
      }
    });
      // token =>{
      //   this.token=token;
      //   this.router.navigate(['waiter']);
      // }
    // })
  }
  // getIdToken(){
    // console.log('toke',this.token);
  // }
}



