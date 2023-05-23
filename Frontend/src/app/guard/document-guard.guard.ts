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
      // check for pjt query param
      console.log(route);
      if (route.queryParams.pjt) {
        // check if user has access to pjt
        // if user has access to pjt, return true
        // else return false
        console.log("ROUTE QUERY PARAMS *********");

        const data: any = await this.documentService.getUsers(route.queryParams.pjt).toPromise();

        console.log(data);
        console.log("Before Return True");

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

    console.log("FINISH");
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
    // try {
    //   // this.tokenService.verifyToken().subscribe(response => {
    //   //   const isValidToken = response.isValidToken;
    //   //   if (isValidToken) {
    //   //     this.router.navigate(['/dashboard']);
    //   //     return true;
    //   //   } else {
    //   //     this.router.navigate(['/login']);
    //   //     return true;
    //   //   }
    //   // }, error => {
    //   //   // maneja el error
    //   // });
    //   // this.documentService.getUsers(this.documentId).subscribe((data: any) => {
    //   //   this.usersObj = data;
    //   //   console.log(this.documentId, this.usersObj);
    //   //   this.tokenService.decodeToken().subscribe((data: any) => {
    //   //     console.log(`${JSON.stringify(data.decoded)}`);
    //   //     this.currentUserEmail = data.decoded.email;
    //   //     console.log(
    //   //       "this.currentUserEmail",
    //   //       this.currentUserEmail,
    //   //       "this.usersObj.owner",
    //   //       this.usersObj.owner
    //   //     );
    //   //     if (this.currentUserEmail === this.usersObj.owner.email) {
    //   //       this.isOwner = true;
    //   //     }
    //   //   });
    //   // });
    //   console.log("ROUTEEEEEEE ********")
    //   console.log(route)
    //   return true;
    // } catch (err) {
    //   // this.router.navigate(['/login']);
    //   return false;
    // }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {
    // console.log("ROUTEEEEEEE ********")
    // console.log(childRoute)

    return this.canAccessDocument(childRoute, state);
  }

  // async canActivateChild( childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
  //   const token = this.cookieService.get('Token');
  //   if (!token) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }

  //   let isValidToken;
  //   try {
  //     this.tokenService.verifyToken().subscribe(response => {
  //       isValidToken = response.isValidToken;
  //       if (isValidToken) {
  //         return true;
  //       } else {
  //         this.router.navigate(['/login']);
  //         return false;
  //       }

  //     }, error => {
  //       // maneja el error
  //     });
  //   } catch (err) {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }
}
