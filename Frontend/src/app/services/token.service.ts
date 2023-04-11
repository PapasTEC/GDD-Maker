import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  API = '/api/token/';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  decodeToken() {
    const token = this.cookieService.get('Token');
    return this.http.post<any>(this.API + 'decode-token/', { "token": token });
  }

  verifyToken() {
    const token = this.cookieService.get('Token');
    return this.http.post<any>(this.API + 'verify-token/', { "token": token });
  }

  generateToken(body: any) {
    return this.http.post<any>(this.API + 'generate-token/', body);
  }
}
