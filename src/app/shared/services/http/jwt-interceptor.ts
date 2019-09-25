import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EvTokenService } from '../auth/token.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private _tokenService: EvTokenService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._tokenService.getToken();
    if (token && req.url.startsWith('api/')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this._tokenService.getToken()}`
        }
      });
    }
    return next.handle(req);
  }

}


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /*  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).catch(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // JWT expired, go to login
            console.log(401);
          }
        }
        return err;
      });
    }*/
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('intercepted request ... ');

// Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('headerName', 'headerValue')});

    console.log('Sending request with new header now ...');

    // send the newly created request
    return next.handle(authReq)
      .catch((error, caught) => {
        // intercept the respons error and displace it to the console
        console.log('Error Occurred');
        console.log(error);
        // return the error to the method that called it
        return Observable.throw(error);
      }) as any;
  }


}
