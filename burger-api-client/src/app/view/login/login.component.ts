import { Component, OnInit } from '@angular/core';
import axios from 'axios';
// import { auth } from '../services/api';

const baseUrl:string = "http://localhost:3000/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  enviar(event: Event): void {
    event.preventDefault();
    console.log('Event ->', event)
    console.log('Otra pagina')
  }
  // constructor() { }

  ngOnInit(): void {
    console.log('AXIOS',axios.get(baseUrl));
  }

}


// export class LoginComponent {
//   enviar(event: Event): void {
//     console.log('Event ->', event)
//   }
// }
