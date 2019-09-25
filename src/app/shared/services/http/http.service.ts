/**
 * Created by cabbar on 19.04.2017.
 */
import { Injectable } from '@angular/core';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EvTokenService } from '../auth/token.service';
import { KbResultDataBase } from './http-result.model';
import { IKbHttpExtraConfig, KbHttpExtraConfig } from './http-result-extra.config';
import { Observable } from 'rxjs/Observable';
import {deepCopy} from "../../utils/utils";

@Injectable()
export class EvHttpService {
  private token: string;
  private defaultConfig: IKbHttpExtraConfig = {
    useApi: true,
    loadingBase: null,
    useToken: true,
    id: 0
  };

  constructor(private http: HttpClient,
              private _tokenService: EvTokenService) {
  }

  delete(url: string, id: any, extra?: IKbHttpExtraConfig): Observable<KbResultDataBase<any[]> | Response | {}> {
    extra = this.getConfig(extra);
    this.showLoading(extra);
    return this.http.delete(`${this.getUrl(url)}/${id}`, this.getHeaderOptions())
      .map((res: Response | KbResultDataBase<any[]>) => {
        this.hideLoading(extra);
        return res;
      })
      .catch(this.showErrorMessage.bind(this));
  }

  get(url: string, extra?: IKbHttpExtraConfig): Observable<KbResultDataBase<any[]>> {
    extra = this.getConfig(extra);
    this.showLoading(extra);
    const obs = this.http.get<KbResultDataBase<any[]>>(this.getUrl(url, extra), this.getHeaderOptions());
    if (extra.useMap) {
      return obs.map((res: KbResultDataBase<any[]>) => {
        this.hideLoading(extra);
        return res;
      })
        .catch(err => {
          // this.notificationService.showError('Servis tarafında bir hata oluştu.
          // Sistem yöneticisine başvurunuz. Hata Kodu: ' + err.status);
          this.hideLoading(extra);
          return Observable.throw(err.error || 'Server error');
        });
    } else {
      return obs;
    }
  }


  getById(url: string, id: number, extra?: IKbHttpExtraConfig): Observable<KbResultDataBase<any[]>> {
    extra = this.getConfig(extra, id);
    this.showLoading(extra);
    return this.http.get(this.getUrl(url, extra), this.getHeaderOptions())
      .map((res: Response) => {
        this.hideLoading(extra);
        return res;
      })
      .catch(err => {
        // this.notificationService.showError('Servis tarafında bir hata oluştu. Sistem yöneticisine başvurunuz. Hata Kodu: ' + err.status);
        this.hideLoading(extra);
        return Observable.throw(err.error || 'Server error');
      });
  }

  post(body: Object, url: string, extra?: IKbHttpExtraConfig): Observable<KbResultDataBase<any[]>> {
    // const headers = new Headers({'Content-Type': 'application/json'});
    // const options = new RequestOptions({headers: headers});
    extra = this.getConfig(extra);
    this.showLoading(extra);
    return this.http.post(this.getUrl(url, extra), body, this.getHeaderOptions())
      .map((res: Response) => {
        this.hideLoading(extra);
        return res;
      })
      .catch(err => {
        // this.notificationService.showError('Servis tarafında bir hata oluştu. Sistem yöneticisine başvurunuz. Hata Kodu: ' + err.status);
        this.hideLoading(extra);
        return Observable.throw(err.error || 'Server error');
      });
  }


  put(body: Object, url?: string, extra?: IKbHttpExtraConfig): Observable<KbResultDataBase<any[]>> {
    extra = this.getConfig(extra, body['id']);
    this.showLoading(extra);
    return this.http.put(this.getUrl(url, extra), JSON.stringify(body), this.getHeaderOptions())
      .map((res: Response) => {
        this.hideLoading(extra);
        return res;
      })
      .catch(err => {
        // this.notificationService.showError('Servis tarafında bir hata oluştu. Sistem yöneticisine başvurunuz. Hata Kodu: ' + err.status);
        this.hideLoading(extra);
        return Observable.throw(err.error || 'Server error');
      });
  }

  reset() {
    this.token = null;
  }

  private getConfig(extra?: IKbHttpExtraConfig, id?: number): IKbHttpExtraConfig {
    if (!extra) {
      extra = deepCopy(this.defaultConfig);
    } else {
      extra = new KbHttpExtraConfig(extra);
    }

    if (id) {
      extra.id = id;
    }
    return extra;
  }

  private getHeaderOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return {headers: headers};
  }

  private getToken(): string {

    if (!this.token) {
      this.token = this._tokenService.getToken();
    }
    return this.token;
  }

  private getUrl(url: string, extra?: IKbHttpExtraConfig): string {
    let _url = '';
    if (extra) {
      if (extra.useApi) {
        _url += 'api/';
      }
      _url += url;
      if (extra.id) {
        _url += `/${extra.id}`;
      }
    } else {
      _url = `api/${url}`;
    }
    return _url;
  }

  private hideLoading(extra: IKbHttpExtraConfig) {
    if (extra && extra.loadingBase) {
      extra.loadingBase.loading = false;
    }
  }

  private showErrorMessage(err: any): any {
    // this.notificationService.showError('Servis tarafında bir hata oluştu. Sistem yöneticisine başvurunuz. Hata Kodu: ' + err.status);
    return Observable.throw(err.error || 'Server error');
  }

  private showLoading(extra: IKbHttpExtraConfig) {
    if (extra && extra.loadingBase) {
      extra.loadingBase.loading = true;
    }
  }

}
