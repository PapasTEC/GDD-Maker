import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API = '/api/users/';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any>(this.API + 'get/');
  }

  getUser(email: string) {
    return this.http.get<any>(this.API + 'get/' + email + '/');
  }

}
