import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUser, User, UserChanges } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly url = `${environment.api}/users`;

  constructor(private http: HttpClient) {}

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  get(id: User['id']): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user: NewUser): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  update(id: User['id'], changes: UserChanges): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}`, changes);
  }

  remove(id: User['id']): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}