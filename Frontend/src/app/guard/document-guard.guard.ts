import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "../services/token.service";
import { DocumentService } from "../services/document.service";

@Injectable({
  providedIn: "root",
})
export class DocumentGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private documentService: DocumentService
  ) {}

  async canAccessDocument(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    try {


      if (route.queryParams.pjt) {





        const data: any = await this.documentService.getUsers(route.queryParams.pjt).toPromise();




        if (data?.error) {
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      }
    } catch (error) {
      this.router.navigate(['/dashboard']);
      return false;
    }


    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canAccessDocument(route, state);





































  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {



    return this.canAccessDocument(childRoute, state);
  }



























}
