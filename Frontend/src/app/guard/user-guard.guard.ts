import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate, CanActivateChild {

  constructor(private tokenService: TokenService, private http: HttpClient, private cookieService: CookieService, private router: Router, private route: ActivatedRoute) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    try {
      this.tokenService.verifyToken().subscribe(response => {
        const isValidToken = response.isValidToken;
        if (isValidToken) {
          this.router.navigate(['/dashboard']);
          return true;
        } else {
          if (state.url === '/login') {
            return true;
          }
          this.router.navigate(['/login']);
          return true;
        }
      }, error => {

      });
    } catch (err) {
      if (state.url === '/register') {
        return true;
      }
      this.router.navigate(['/login']);
      return true; // CAMBIAR
    }
  }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const token = this.cookieService.get('Token');
    if (!token) {
      if (state.url === '/register') {
        return true;
      } else if (state.url.includes('/editor')) {
        this.route.queryParams.subscribe(params => {
          if (params.pjt && params.readOnly) {
            localStorage.setItem('readOnly', 'true');
            return true;
          }//else{



        });
      }else{
         this.router.navigate(['/login']);
         return false;
       }
    }

    let isValidToken;
    try {
      this.tokenService.verifyToken().subscribe(response => {
        isValidToken = response.isValidToken;
        if (isValidToken) {
          return true;
        } else {
          if (state.url === '/register') {
            return true;
          }

          return false;
        }

      }, error => {

      });
    } catch (err) {
      if (state.url === '/register') {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }

}
