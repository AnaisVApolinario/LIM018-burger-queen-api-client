import { Injectable } from '@angular/core';
import { LoginI } from 'src/app/modelos/login.interface';
import { ResponseI } from 'src/app/modelos/response.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

   private url: string = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

    loginByEmail(form: LoginI): Observable<ResponseI> {
        let direccion = this.url + "/auth";
        return this.http.post<ResponseI>(direccion, { email: form.email, password: form.password });
    }

}













