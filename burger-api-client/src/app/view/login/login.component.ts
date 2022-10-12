import { Component, OnInit } from '@angular/core';
//import axios from 'axios';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { auth } from '../services/api';

const baseUrl: string = "http://localhost:3000/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor() { }

  ngOnInit(): void {
    //console.log('AXIOS', axios.get(baseUrl));
  }

  onLogin(form: any) {

    console.log(form)
  }


  // export class LoginComponent implements OnInit {
  //   enviar(event: Event): void {
  //     event.preventDefault();
  //     console.log('Event ->', event)
  //     console.log('Otra pagina')
  //   }
  //   // constructor() { }



}


// export class LoginComponent {
//   enviar(event: Event): void {
//     console.log('Event ->', event)
//   }
// }
