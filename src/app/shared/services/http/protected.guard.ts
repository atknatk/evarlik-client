import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EvTokenService } from '../auth/token.service';
import { isNullOrUndefined } from 'util';
import 'rxjs/add/observable/of';


/**
 * Guard, checks access token availability and allows or disallows access to page,
 * and redirects out
 *
 * usage: { path: 'test', component: TestComponent, canActivate: [ AuthGuard ] }
 *
 * @export
 *
 * @class ProtectedGuard
 *
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 */
@Injectable()
export class ProtectedGuard implements CanActivate, CanActivateChild {

  constructor(private _token: EvTokenService,
              private router: Router) {
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
      this.navigate('/');
      return Observable.of(false);
    }
    return Observable.of(true);
  }

  /**
   * CanActivateChild handler
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   *
   * @returns {Observable<boolean>}
   */
  public canActivateChild(route: ActivatedRouteSnapshot,
                          state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  private navigate(url: string): void {
    if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      this.router.navigateByUrl(url);
    }
  }

}
