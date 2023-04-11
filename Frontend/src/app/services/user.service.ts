import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API = '/api/users/';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.API + 'get/');
  }

  getUser(email: string) {
    return this.http.get<any>(this.API + 'get/' + email + '/');
  }

  addOwnProject(email: string, id: string) {
    return this.http.put<any>(this.API + 'addOwnProject/' + email, { "id": id });
  }

  addSharedProject(email: string, id: string) {
    return this.http.put<any>(this.API + 'addSharedProject/' + email, { "id": id });
  }

  removeOwnProject(email: string, id: string) {
    return this.http.put<any>(this.API + 'deleteOwnProject/' + email, { "id": id });
  }

  removeSharedProject(email: string, id: string) {
    return this.http.put<any>(this.API + 'deleteSharedProject/' + email, { "id": id });
  }

  checkUserExists(email: string) {
    return this.http.get<any>(this.API + 'check/' + email + '/');
  }

  provideCodeUser(email: string) {
    return this.http.put<any>(this.API + 'sendCode/' + email + '/', {});
  }

  login(email: string, code: string) {
    return this.http.get<any>(this.API + 'login/' + email + '/' + code)
  }

}
