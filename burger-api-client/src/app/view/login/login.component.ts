import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private api: LoginService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('pame@gmail.com', Validators.required),
      password: new FormControl('123456', Validators.required)
    })
  }

  errorStatus: boolean = false;
  errorMsj: any = '';


  ngOnInit(): void {

  }

  onLogin() {

    console.log('LOGIN FORM VALUE', this.loginForm.value);
    this.api.postLogin(this.loginForm.value)
      .subscribe({
        next: (data) => {
          if (data) {
            localStorage.setItem("token", data.token)
            this.router.navigate(['waiter']);
          }
        }, error: (error) => {
          console.log(error)
          this.errorStatus = true;
          this.errorMsj = "Las datos son incorrectos";
        }
      });
  }

}



