import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginI } from 'src/app/modelos/login.interface';
import { ResponseI } from 'src/app/modelos/response.interface';
import { ListaEmpleadosI } from 'src/app/modelos/listaEmpleados.interface';


export interface Products {
  _id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  dateEntry: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  

private readonly API = environment.api;

  constructor(private readonly http:HttpClient) { }


  loginByEmail(form: LoginI): Observable<ResponseI> {
      let direccion = this.API + "auth";
      return this.http.post<ResponseI>(direccion, { email: form.email, password: form.password });
  }

  getProducts(): Observable<Products[]> {
    let direccion =this.API + "products"
    return this.http.get<Products[]>(direccion)
   }
  updateCity(city: Products): Observable<void> { 
    const body = {name:city.name};
    let direccion =this.API + "auth"
    return this.http.put<void>(`${direccion}/${city._id}`, body)
  }
  deleteCity(id: string): Observable<void> { 
    let direccion =this.API + "auth"
    return this.http.delete<void>(`${direccion}/${id}`);
  }

  getAllEmpleados():Observable<ListaEmpleadosI[]>{
    let direccion =this.API + "users"
    return this.http.get<ListaEmpleadosI[]>(direccion);
  }
  

}



 

