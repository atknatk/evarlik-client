import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { EvNotificationService } from '../notification/notification.service';


export interface IValidationErrorInfo {

  message: string;

  members: string[];

}


export interface IErrorInfo {

  code: number;

  message: string;

  details: string;

  validationErrors: IValidationErrorInfo[];

}

export interface IAjaxResponse {

  success: boolean;

  result?: any;

  targetUrl?: string;

  error?: IErrorInfo;

  unAuthorizedRequest: boolean;

  __kb: boolean;

}


@Injectable()
export class KbHttpConfiguration {

  defaultError = <IErrorInfo>{
    message: 'An error has occurred!',
    details: 'Error detail not sent by server.'
  };
  defaultError401 = <IErrorInfo>{
    message: 'You are not authenticated!',
    details: 'You should be authenticated (sign in) in order to perform this operation.'
  };
  defaultError403 = <IErrorInfo>{
    message: 'You are not authorized!',
    details: 'You are not allowed to perform this operation.'
  };
  defaultError404 = <IErrorInfo>{
    message: 'Resource not found!',
    details: 'The resource requested could not found on the server.'
  };

  constructor(private _nfService: EvNotificationService) {

  }

  getKbAjaxResponseOrNull(response: Response): IAjaxResponse | null {
    if (!response || !response.headers) {
      return null;
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType) {
     // this._logService.warn('Content-Type is not sent!');
      return null;
    }

    if (contentType.indexOf('application/json') < 0) {
      // this._logService.warn('Content-Type is not application/json: ' + contentType);
      return null;
    }

    const responseObj = response.json();
    if (!responseObj.__abp) {
      return null;
    }

    return responseObj as IAjaxResponse;
  }

  handleError(error: Response): Observable<any> {
    const ajaxResponse = this.getKbAjaxResponseOrNull(error);
    if (ajaxResponse != null) {
      this.handleKbResponse(error, ajaxResponse);
      return Observable.throw(ajaxResponse.error);
    } else {
      this.handleNonKbErrorResponse(error);
      return Observable.throw('HTTP error: ' + error.status + ', ' + error.statusText);
    }
  }

  handleKbResponse(response: Response, ajaxResponse: IAjaxResponse): Response {

    const newResponse = new ResponseOptions({
      url: response.url,
      body: ajaxResponse,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      type: response.type
    });

    if (ajaxResponse.success) {
      newResponse.body = ajaxResponse.result;

      if (ajaxResponse.targetUrl) {
        this.handleTargetUrl(ajaxResponse.targetUrl);
      }
    } else {
      if (!ajaxResponse.error) {
        ajaxResponse.error = this.defaultError;
      }

      this.logError(ajaxResponse.error);
      this.showError(ajaxResponse.error);

      if (response.status === 401) {
        this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
      }
    }

    return new Response(newResponse);
  }

  handleNonKbErrorResponse(response: Response) {
    const self = this;

    switch (response.status) {
      case 401:
        self.handleUnAuthorizedRequest(
          self.showError(self.defaultError401),
          '/'
        );
        break;
      case 403:
        self.showError(self.defaultError403);
        break;
      case 404:
        self.showError(self.defaultError404);
        break;
      default:
        self.showError(self.defaultError);
        break;
    }
  }

  handleResponse(response: Response): Response {
    const ajaxResponse = this.getKbAjaxResponseOrNull(response);
    if (ajaxResponse == null) {
      return response;
    }

    return this.handleKbResponse(response, ajaxResponse);
  }

  handleTargetUrl(targetUrl: string): void {
    if (!targetUrl) {
      location.href = '/#auth/login';
    } else {
      location.href = targetUrl;
    }
  }

  handleUnAuthorizedRequest(messagePromise: any, targetUrl?: string) {
    const self = this;

    if (messagePromise) {
      messagePromise.done(() => {
        this.handleTargetUrl(targetUrl || '/');
      });
    } else {
      self.handleTargetUrl(targetUrl || '/');
    }
  }

  logError(error: IErrorInfo): void {
   // this._logService.error(error);
  }

  showError(error: IErrorInfo): any {
    if (error.details) {
      return this._nfService.error(error.details, error.message || this.defaultError.message);
    } else {
      return this._nfService.error('', error.message || this.defaultError.message);
    }
  }
}
