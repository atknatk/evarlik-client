import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { KbResultDataBase } from '../http/http-result.model';
import { unescape } from 'querystring';
import { EvTokenService } from '../auth/token.service';

declare const $: any;

@Injectable()
export class FileUploadService {

  constructor(private _storage: EvTokenService) {
  }

  upload(file): Observable<KbResultDataBase<any>> {
    return this.uploadFormData(file.name, file);
  }

  uploadDataUri(filename, dataURI): Observable<KbResultDataBase<any>> {
    const blob = this.dataURItoBlob(dataURI);
    return this.uploadFormData(filename, blob);
  }

  private dataURItoBlob(dataURI) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }

  private uploadFormData(filename, file): Observable<KbResultDataBase<any>> {
    return Observable.create(promise => {
      const formData = new FormData();
      formData.append(file.name, file);
      const xhr = new XMLHttpRequest();
      const url = '/api/attachment/uploadfile';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${this._storage.getToken()}`);
      xhr.onload = (e) => {
        const response = $.parseJSON(e.target['response']);
        promise.next(response);
        promise.complete();
      };
      xhr.send(formData);
    });
  }


}
