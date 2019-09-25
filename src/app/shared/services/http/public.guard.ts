import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EvTokenService } from '../auth/token.service';
import { isNullOrUndefined } from "util";


/**
 * Guard, checks access token availability and allows or disallows access to page,
 * and redirects out
 *
 * usage: { path: 'test', component: TestComponent, canActivate: [ PublicGuard ] }
 *
 * @export
 *
 * @class PublicGuard
 *
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 */
@Injectable()
export class PublicGuard implements CanActivate, CanActivateChild {
  constructor(private _token: EvTokenService,
              private router: Router) {
  }

  public canActivateChild(route: ActivatedRouteSnapshot,
                          state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  /**
   * CanActivate handler
   *
   * @param {ActivatedRouteSnapshot} _route
   * @param {RouterStateSnapshot} state
   *
   * @returns {Observable<boolean>}
   */
  public canActivate(_route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> {
    const token = this._token.getToken();
    if (isNullOrUndefined(token)) {
      return Observable.of(true);
    } else {
      this.navigate('/trade/bitcoin');
      return Observable.of(false);
    }

  }


  /**
   * Navigate away from the app / path
   *
   * @private
   * @param {string} url
   */
  private navigate(url: string): void {
    if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      this.router.navigateByUrl(url);
    }
  }

}
