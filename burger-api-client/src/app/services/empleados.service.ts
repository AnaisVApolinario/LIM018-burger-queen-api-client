import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ListaEmpleadosI } from '../modelos/listaEmpleados.interface';
import { EmpleadoI } from '../modelos/empleado.interface';

@Injectable({providedIn: 'root'})

export class empleadoService {
  private readonly API = environment.api;
  // private handleError: HandleError;

  constructor(private http: HttpClient) { }
  
  getAllEmpleados(): Observable<ListaEmpleadosI[]> {
    let endpoint = this.API + "users"
    return this.http.get<ListaEmpleadosI[]>(endpoint,{
      headers : {
        Authorization: "Bearer EsUnSecreto",
      }
    });
  }

  getSingleEmpleado(id:any):Observable<EmpleadoI>{
    let endpoint = this.API + "users?id=" + id;
    return this.http.get<EmpleadoI>(endpoint,{
      headers : {
        Authorization: "Bearer EsUnSecreto",
      }
    });
  }
}