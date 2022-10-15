import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  addNewCity(city:string): Observable<Products> {
    const body = {name: city};
    return this.http.post<Products>(this.API, body);
   }
  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.API)
   }
  updateCity(city: Products): Observable<void> { 
    const body = {name:city.name};
    return this.http.put<void>(`${this.API}/${city._id}`, body)
  }
  deleteCity(id: string): Observable<void> { 
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
