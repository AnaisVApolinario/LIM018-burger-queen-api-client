import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
// import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { LoginI } from 'src/app/modelos/login.interface';
// import { ResponseI } from 'src/app/modelos/response.interface';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

@Injectable({providedIn: 'root'})

export class LoginService {
    private readonly API = environment.api;
    // private handleError: HandleError;

    constructor(private http: HttpClient) { }  
  
    postLogin(data: LoginI): Observable<any> {
        const endpoint = this.API + "auth";
        return this.http.post(endpoint, data, httpOptions);
    }
}