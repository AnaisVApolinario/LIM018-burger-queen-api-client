import { Injectable } from '@angular/core';
import { LoginI } from 'src/app/modelos/login.interface'; 
import { ResponseI } from 'src/app/modelos/response.interface'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class ApiService {

    url:string = "http://localhost:3000/";
    constructor(private http:HttpClient){ }

    loginByEmail(form:LoginI):Observable<ResponseI>{
let direccion = this.url + "auth";
        return this.http.post<ResponseI>(direccion,{email: form.usuario, password:form.password});
    }
    
}














// import axios from 'axios'

// const BASE_URL = "http://localhost:3000"

// const authPath = "/auth"

// export const auth = (email:string ,password:string) => {
//     return axios.post(`${BASE_URL}${authPath}`,{email,password})
// }