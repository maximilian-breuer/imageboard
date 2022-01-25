import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  backend = environment.backendpath + "/api/v1";

  constructor(private http: HttpClient) { }

  register(username: string, password:string): Observable<any> {
    return this.http.post(`${this.backend}/users/register`, {username: username, password:password});
  }


}
