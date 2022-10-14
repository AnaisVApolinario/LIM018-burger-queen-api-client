import { Component, OnInit } from '@angular/core';
///import { from } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { auth } from '../services/api';
import { ApiService } from 'src/services/api';
import { LoginI } from 'src/app/modelos/login.interface';

const baseUrl: string = "http://localhost:3000/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    usuario : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required)
  })

  constructor(private api:ApiService) { }

  ngOnInit(): void {

  }

  onLogin(form: LoginI){
    this.api.loginByEmail(form).subscribe(data =>{
      console.log(data);
    })
    
  }


}




  // export class LoginComponent implements OnInit {
  //   enviar(event: Event): void {
  //     event.preventDefault();
  //     console.log('Event ->', event)
  //     console.log('Otra pagina')
  //   }
  //   // constructor() { }






// export class LoginComponent {
//   enviar(event: Event): void {
//     console.log('Event ->', event)
//   }
// }
