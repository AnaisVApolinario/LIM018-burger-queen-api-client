import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MenuType, NewProduct, Product, ProductChanges } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly url = `${environment.api}/products`;

  constructor(private http: HttpClient) {}

  list(type?: MenuType): Observable<Product[]> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<Product[]>(this.url, { params });
  }

  get(id: Product['id']): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(product: NewProduct): Observable<Product> {
    return this.http.post<Product>(this.url, {
      ...product,
      dateEntry: new Date().toISOString(),
    });
  }

  update(id: Product['id'], changes: ProductChanges): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${id}`, changes);
  }

  remove(id: Product['id']): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}