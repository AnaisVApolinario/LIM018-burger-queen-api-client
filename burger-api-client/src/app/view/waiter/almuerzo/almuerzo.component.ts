import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-almuerzo',
  templateUrl: './almuerzo.component.html',
  styleUrls: ['./almuerzo.component.css']
})
export class AlmuerzoComponent implements OnInit {
  products = [{
    "id": "01",
    "name": "Cafe Americano",
    "price": 5,
    "image": "",
    "type": "desayuno",
    "dateEntry": ""
  }
];

  constructor() { }

  ngOnInit(): void {
    //actulizar datos de verdad aquí
  }

}
