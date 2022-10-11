import { Component, OnInit } from '@angular/core';

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
  }

}
// export class LoginComponent {
//   enviar(event: Event): void {
//     console.log('Event ->', event)
//   }
// }
