import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  backend = environment.backendpath + "/api/v1";

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
      return this.http.post<any>(`${this.backend}/users/login`, { username: username, password: password })

          .pipe(map(token => {
              if (token) {
                  localStorage.setItem('currentUser', <string> token);
              }

              return token;
          }));
  }

  logout() {
      localStorage.removeItem('currentUser');
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('currentUser');
    return token != null;
  }

  getHeader(): HttpHeaders {
    const token: string = <string> localStorage.getItem('currentUser');
    return new HttpHeaders().set('Authorization',  `Basic ${token}`)
  }
}
