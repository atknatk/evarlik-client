import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPriceModel, PriceModel } from '../../+trade/coin/model/price.model';
import { evarlikConfig } from '../../../shared/evarlik.config';
import { EvTokenService } from '../../../shared/services/auth/token.service';
import { EvHttpService } from '../../../shared/services/http/http.service';
import { EvNotificationService } from '../../../shared/services/notification/notification.service';
import { EvStorageService } from '../../../shared/services/storage/storage.service';
import { PasswordValidation } from '../../../shared/utils/password-validation';
import { getPhoneMaskValue, phoneMask } from '../../../shared/utils/phone-mask';
import { coinType } from '../../coinnavigation/coin.enum';

declare const $: any;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  rememberForm: FormGroup;
  registerForm: FormGroup;
  coinType = coinType;

  btc: IPriceModel = new PriceModel(coinType.btc);
  ltc: IPriceModel = new PriceModel(coinType.ltc);
  doge: IPriceModel = new PriceModel(coinType.doge);
  xrp: IPriceModel = new PriceModel(coinType.xrp);
  iota: IPriceModel = new PriceModel(coinType.iota);


  constructor(private _fb: FormBuilder,
              private _service: EvHttpService,
              private _storage: EvStorageService,
              private _nf: EvNotificationService,
              private _token: EvTokenService,
              private _route: Router) {

  }

  _authType = 'login';

  get authType() {
    return this._authType;
  }

  set authType(val) {
    this._authType = val;
    if (val === 'register') {
      setTimeout(() => phoneMask('register-phone'), 100);
    }
  }

  getFormValidationErrors(form: FormGroup): string[] {
    const errors = [];
    Object.keys(form.controls).forEach(key => {

      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          let alanAdi = '';
          let error = '';
          if (key == 'name') {
            alanAdi = 'Ad';
          } else if (key == 'surname') {
            alanAdi = 'Soyad';
          } else if (key == 'mail') {
            alanAdi = 'Email';
          } else if (key.indexOf('password') !== -1) {
            alanAdi = 'Şifre';
          }
          if (keyError === 'required') {
            error = 'zorunludur.';
          } else if (keyError === 'email') {
            error = 'geçerli bir email adresi olmalıdır.';
          } else if (keyError === 'MatchPassword') {
            errors.push(`Şifreler uyuşmuyor`);
            return;
          } else if (keyError === 'min') {
            error = `en az ${controlErrors[keyError]['min']} karakter olmalıdır.`;
          }

          errors.push(`${alanAdi} alanı ${error}`);

          // console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });

    return errors;
  }

  getIncreaseSvg(isIncrease) {
    return isIncrease ? 'assets/img/icons/up.svg' : 'assets/img/icons/down.svg';
  }

  login() {
    if (!this.loginForm.valid) {
      const errors = this.getFormValidationErrors(this.loginForm);
      this._nf.warn(errors[0]);
      return;
    }
    const value = this.loginForm.value;
    this._service.post(value, 'user/login', {
      useToken: false
    }).subscribe(res => {
      if (res.isSuccess) {
        this._service.reset();
        this._token.clearToken();
        this._storage.setItem(evarlikConfig.authUserKey, res.data);
        this._route.navigate(['trade/bitcoin']);
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  ngOnInit(): void {
    this.setPrice();
    this.loginForm = this._fb.group({
      mail: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.min(8)])]
    });

    this.rememberForm = this._fb.group({
      mail: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.registerForm = this._fb.group({
      name: ['', Validators.compose([Validators.required, Validators.min(3)])],
      surname: ['', Validators.compose([Validators.required, Validators.min(2)])],
      mail: ['', Validators.compose([Validators.required, Validators.email])],
      phone: [''],
      password: ['', Validators.compose([Validators.required, Validators.min(8)])],
      sozlesme: false,
      confirmPassword: ['', Validators.compose([Validators.required, Validators.min(8)])]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  register() {
    if (!this.registerForm.valid) {
      const errors = this.getFormValidationErrors(this.registerForm);
      this._nf.warn(errors[0]);
      return;
    }
    const value = this.registerForm.value;
    const phone = $('#register-phone').val();
    if (phone === '') {
      this._nf.warn('Lütfen telefon numarınızı giriniz.');
      return;
    }

    if (value.password.length < 8) {
      this._nf.warn('Şifre en az 8 karakter olmalıdır.');
      return;
    }

    if (value.sozlesme === false) {
      this._nf.warn('Lütfen sözlemeyi onaylayınız');
      return;
    }

    value.phone = getPhoneMaskValue(phone);
    this._service.post(value, 'User/Register', {
      useToken: false
    }).subscribe(res => {
      if (res.isSuccess) {
        this._nf.success('Başarılı bir şekilde kayıt oldunuz.');
        this.authType = 'login';
      } else if (res.status == 6) {
        this._nf.warn('Bu hesap zaten kayıtlı. Şifrenizimi unuttunuz?');
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  remember() {
    if (!this.rememberForm.valid) {
      const errors = this.getFormValidationErrors(this.rememberForm);
      this._nf.warn(errors[0]);
      return;
    }
    const value = this.rememberForm.value;
    this._service.post(value, 'User/ForgotPassword', {
      useToken: false
    }).subscribe(res => {
      if (res.isSuccess) {
        this._nf.success('Yeni şifreniz email adresinize gönderildi.');
        this.authType = 'login';
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  setPrice() {
    const date = new Date().getTime();
    const url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,XRP,DOGE,LTC,IOTA&tsyms=USD,TRY&_=' + date;
    $.getJSON(url, (data: any) => {
      if (data.RAW && data.DISPLAY) {
        const raw = data.RAW;
        const display = data.DISPLAY;
        if (raw.BTC.USD && raw.BTC.TRY && display.BTC.USD && display.BTC.TRY) {
          this.btc = new PriceModel(coinType.btc, display.BTC.TRY.PRICE.substring(4),
            display.BTC.USD.CHANGEPCT24HOUR > 0, display.BTC.USD.CHANGEPCT24HOUR);
        }
        if (raw.XRP.USD && raw.XRP.TRY && display.XRP.USD && display.XRP.TRY) {
          this.xrp = new PriceModel(coinType.xrp, display.XRP.TRY.PRICE.substring(4),
            display.XRP.USD.CHANGEPCT24HOUR > 0, display.XRP.USD.CHANGEPCT24HOUR);
        }
        if (raw.DOGE.USD && raw.DOGE.TRY && display.DOGE.USD && display.DOGE.TRY) {
          this.doge = new PriceModel(coinType.doge, display.DOGE.TRY.PRICE.substring(4),
            display.DOGE.USD.CHANGEPCT24HOUR > 0, display.DOGE.USD.CHANGEPCT24HOUR);
        }
        if (raw.LTC.USD && raw.LTC.TRY && display.LTC.USD && display.LTC.TRY) {
          this.ltc = new PriceModel(coinType.ltc, display.LTC.TRY.PRICE.substring(4),
            display.LTC.USD.CHANGEPCT24HOUR > 0, display.LTC.USD.CHANGEPCT24HOUR);
        }
        if (raw.IOTA.USD && raw.IOTA.TRY && display.IOTA.USD && display.IOTA.TRY) {
          this.iota = new PriceModel(coinType.iota, display.IOTA.TRY.PRICE.substring(4),
            display.IOTA.USD.CHANGEPCT24HOUR > 0, display.IOTA.USD.CHANGEPCT24HOUR);
        }

      }
    });
  }

}
