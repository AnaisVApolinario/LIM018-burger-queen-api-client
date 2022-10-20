import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ListaEmpleadosI } from '../modelos/listaEmpleados.interface';

@Injectable({providedIn: 'root'})

export class empleadoService {
  private readonly API = environment.api;
  // private handleError: HandleError;

  constructor(private http: HttpClient) { }
  
  getAllEmpleados(): Observable<ListaEmpleadosI[]> {
    let direccion = this.API + "users"
    return this.http.get<ListaEmpleadosI[]>(direccion,{
      headers : {
        Authorization: "Bearer EsUnSecreto",
      }
    });
  }

}