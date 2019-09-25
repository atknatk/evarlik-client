import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { EvTokenService } from '../../shared/services/auth/token.service';
import { KbResultDataBase } from '../../shared/services/http/http-result.model';
import { EvHttpService } from '../../shared/services/http/http.service';
import { EvNotificationService } from '../../shared/services/notification/notification.service';
import { PasswordValidation } from '../../shared/utils/password-validation';

declare const $: any;

@Component({
  templateUrl: './personal.component.html'
})
export class PersonalComponent implements OnInit, AfterViewInit {
  personalForm: FormGroup;
  passwordForm: FormGroup;
  private isProcessing = false;
  user = {};

  constructor(private _http: EvHttpService,
              private _fb: FormBuilder,
              private _token: EvTokenService,
              private _nf: EvNotificationService) {

  }

  changePassword() {
    const formValue = this.passwordForm.value;
    const val = $.extend(true, {}, formValue);
    if (val.password.length < 8 || val.oldPassword.length < 8) {
      this._nf.warn('Şifre en az 8 karakter olmalıdır.');
      return;
    }
    if (val.password != val.confirmPassword) {
      this._nf.warn('Şifreleriniz uyuşmamaktadır');
      return;
    }

    delete val['confirmPassword'];
    this._http.post(val, 'User/UpdatePassword').subscribe(res => {
      if (res.status == 5) {
        this._nf.error('Hatalı şifre girdiniz');
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  initPasswordForm() {
    this.passwordForm = this._fb.group({
      oldPassword: ['', Validators.compose([Validators.required, Validators.min(8)])],
      password: ['', Validators.compose([Validators.required, Validators.min(8)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.min(8)])]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  initPersonalForm() {
    this.personalForm = this._fb.group({
      name: [{value: null, disabled: true}],
      surname: [{value: null, disabled: true}],
      identityNo: null,
      mail: [{value: null, disabled: true}],
      phone: [{value: null, disabled: true}],
      iban: null,
      bankName: null,
      adres: null,
      idIdentityFilePath: null,
      idIdentityFilePath2: null
    });
  }

  loadUserInfo() {
    this._http.get('User').subscribe(res => {
      if (res.isSuccess) {
        this.personalForm.patchValue(res.data);
        this.user = res.data;
      }
    });
  }

  ngAfterViewInit(): void {

    $('#iban_no').mask('SS00 0000 0000 0000 0000 00');
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.initPersonalForm();
    this.initPasswordForm();
  }

  onFileChange(event, idOrder: string) {
    const files = event.target.files;
    if (files.length === 1) {
      if (files[0].size / 1024 / 1024 > 5) {
        this._nf.warn('Dosya boyutu en fazla 5 MB olabilir.');
        return;
      }
      this.isProcessing = true;
      this.uploadFormData(files[0]).subscribe(result => {
        if (result.isSuccess) {
          const control = this.personalForm.get('idIdentityFilePath' + idOrder);
          control.setValue(result.objectId);
        } else {
          this._nf.error('Kimlik yüklemesinde bir hata oluştu. Sonra tekrar deneyiniz.');
        }
        this.isProcessing = false;
      });
    }
  }

  updatePersonal() {
    if (this.isProcessing === true) {
      this._nf.warn('Kimlik yükleme halen devam etmektedir. 10 sn sonra tekrar onaylayınız.');
      return;
    }
    const val = this.personalForm.value;
    if (val.identityNo && val.identityNo.length != 11) {
      this._nf.warn('Hatalı TC Kimlik No girdiniz.');
      return;
    }
    this._http.post(val, 'User').subscribe(res => {
      this._nf.showResultMessage(res);
    });
  }

  private uploadFormData(file): Observable<KbResultDataBase<any>> {
    return Observable.create(promise => {
      const formData = new FormData();
      formData.append(file.name, file);
      const xhr = new XMLHttpRequest();
      const url = '/api/attachment/uploadfile';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${this._token.getToken()}`);
      xhr.onload = (e) => {
        const response = $.parseJSON(e.target['response']);
        promise.next(response);
        promise.complete();
      };
      xhr.send(formData);
    });
  }


}
