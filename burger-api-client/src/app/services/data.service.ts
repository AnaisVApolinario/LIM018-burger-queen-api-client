import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from '../modelos/products.interface';


@Injectable({
  providedIn: 'root'
})
export class DataService {

private readonly API = environment.api;

  constructor(private readonly http:HttpClient) { }

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
  
}



 

