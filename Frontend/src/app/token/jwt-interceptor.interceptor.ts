import { Injectable } from '@angular/core';
import {Route, Router} from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.cookieService.get('Token');
    let newRequest = request;

    if (token) {
      newRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
    }

    return next.handle(newRequest).pipe(
      /*
      Error 500: Internal Server Error
      Error 501: Not Implemented
      Error 502: Bad Gateway
      Error 503: Service Unavailable
      Error 504: Gateway Timeout
      Error 505: HTTP Version Not Supported

      Error 401: Unauthorized
      */
      catchError((error: HttpErrorResponse) => {
      // Client Error
        if(error.status === 400){
          alert('The request was not understood by the server. Please try again later.');
        }else if (error.status === 401){
          alert('You are not authorized to access this page.');
        }else if (error.status === 402) {
          alert('Payment is required to access this page. Please try again later.');
        }else if (error.status === 403) {
          alert('You are forbidden to access this page. Please try again later.');
        }else if (error.status === 404) {
          alert('The requested page could not be found. Please try again later.');
        }else if(error.status === 405){
          alert('The request method is not allowed. Please try again later.');
        }else if(error.status === 406){
          alert('The server cannot send data in the format specified in the request. Please try again later.');
        }else if(error.status === 407){
          alert('You must authenticate with a proxy server before this request can be served. Please try again later.');
        }else if(error.status === 408){
          alert('The server timed out waiting for the request. Please try again later.');
        }else if(error.status === 409){
          alert('The request could not be completed because of a conflict. Please try again later.');
        }else if(error.status === 410){
          alert('The requested page is no longer available. Please try again later.');
        }else if(error.status === 411){
          alert('The "Content-Length" is not defined. Please try again later.');
        }else if(error.status === 412){
          alert('The precondition given in the request evaluated to false by the server. Please try again later.');
        }else if(error.status === 413){
          alert('The server will not accept the request, because the request entity is too large. Please try again later.');
        }else if(error.status === 414){
          alert('The server will not accept the request, because the URL is too long. Please try again later.');
        }else if(error.status === 415){
          alert('The server will not accept the request, because the media type is not supported. Please try again later.');
        }else if(error.status === 416){
          alert('The client has asked for a portion of the file, but the server cannot supply that portion. Please try again later.');
        }else if(error.status === 417){
          alert('The server cannot meet the requirements of the Expect request-header field. Please try again later.');
        }else if(error.status === 418){
          alert('I\'m a teapot. Please try again later.');
        }else if(error.status === 421){
          alert('The request was directed at a server that is not able to produce a response. Please try again later.');
        }else if(error.status === 422){
          alert('The request was well-formed but was unable to be followed due to semantic errors. Please try again later.');
        }else if(error.status === 423){
          alert('The resource that is being accessed is locked. Please try again later.');
        }else if(error.status === 424){
          alert('The request failed due to failure of a previous request. Please try again later.');
        }else if(error.status === 425){
          alert('The server is unwilling to risk processing a request that might be replayed. Please try again later.');
        }else if(error.status === 426){
          alert('The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. Please try again later.');
        }else if(error.status === 428){
          alert('The origin server requires the request to be conditional. Please try again later.');
        }else if(error.status === 429){
          alert('The user has sent too many requests in a given amount of time. Please try again later.');
        }else if(error.status === 431){
          alert('The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large. Please try again later.');
        }else if(error.status === 451){
          alert('The user requests an illegal resource, such as a web page censored by a government. Please try again later.');
        }
        // Server Error
        if(error.status === 500){
          alert('An error ocurred while processsing your request. Please try again later.');
        }else if (error.status === 501){
          alert('The request method you are using is not supported. Please try again later.');
        }else if (error.status === 502) {
          alert('The server got an invalid response. Please try again later.');
        }else if (error.status === 503) {
          alert('The server is currently unavailable. Please try again later.');
        }else if (error.status === 504) {
          // Cuando se cae el backend
          alert('The server is currently unavailable. Please try again later.');
          this.router.navigate(['/login']);
        }else if(error.status === 505){
          alert('The server does not support the HTTP protocol version used in the request. Please try again later.');
        }else if(error.status === 507){
          alert('The server is running out of space right now. Please try again later.');
        }else if(error.status === 508){
          alert('The server detected an infinite loop while processing the request. Please try again later.');
        }else if(error.status === 509){
          alert('The server has reached its bandwidth limit. Please try again later.');
        }else if(error.status === 510){
          alert('The server did not receive a complete request. Please try again later.');
        }else if(error.status === 511){
          alert('The client needs to authenticate to gain network access. Please try again later.');
        }
        
        return new Observable<HttpEvent<Response>>();
      })
    );


  }
}
