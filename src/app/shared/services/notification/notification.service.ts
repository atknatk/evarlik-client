import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { KbConfirmationService } from '../../component/notification/confirmations/confirmations.service';
import { KbResolveEmit } from '../../component/notification/confirmations/interfaces/resolve-emit';
import { NotificationsService } from '../../component/notification/simple/services/notifications.service';
import { KbResultBase } from '../http/http-result.model';

@Injectable()
export class EvNotificationService {
  constructor(public _service: NotificationsService,
              private _confirmation: KbConfirmationService) {

  }

  alert(content: string, title?: string, override?: any) {
    this._service.alert(content, title, override);
  }

  bare(content: string, title?: string, override?: any) {
    this._service.bare(content, title, override);
  }

  error(content: string, title?: string, override?: any) {
    this._service.error(content, title, override);
  }

  info(content: string, title?: string, override?: any) {
    this._service.info(content, title, override);
  }

  removeConfirm(cb: () => void,
                afterDelete?: (param1?: any, param2?: any, param3?: any, param4?: any) => void,
                param1?: any,
                param2?: any,
                param3?: any,
                param4?: any) {
    this._confirmation.create('Silme İşlemi', 'Silmeyi Onaylıyor musunuz ? ', {
      confirmText: 'Evet',
      declineText: 'Hayır'
    }).subscribe((ans: KbResolveEmit) => {
      if (ans.resolved === true) {
        cb();
        if (afterDelete) {
          afterDelete(param1, param2, param3, param4);
        }
      } else {
        this.info('İşleminiz isteğiniz üzerine iptal edilmiştir.');
      }
    });
  }

  removeConfirmObservable(cb: () => Observable<any>,
                          afterSuccesDelete?: (param1?: any, param2?: any, param3?: any, param4?: any) => void,
                          param1?: any,
                          param2?: any,
                          param3?: any,
                          param4?: any) {
    this._confirmation.create('Silme İşlemi', 'Silmeyi Onaylıyor musunuz ? ', {
      confirmText: 'Evet',
      declineText: 'Hayır'
    }).subscribe((ans: KbResolveEmit) => {
      if (ans.resolved === true) {
        const result: Observable<any> = cb();
        result.subscribe(res => {
          if (res.isSuccess) {
            this.info('Silme işleminiz başarılı bir şekilde gerçekleşmiştir.');
            afterSuccesDelete(param1, param2, param3, param4);
          } else {
            // this.showKobipResultMessage(res);
          }
        });
      } else {
        this.info('İşleminiz isteğiniz üzerine iptal edilmiştir.');
      }
    });

  }

  showResultMessage(res: KbResultBase) {
    if (res.isSuccess) {
      this.success('İşleminiz başarılı bir şekilde gerçekleşmiştir.');
    } else if (res.status === 2) {
      if (res.message) {
        this.warn('Eksik alan girdiniz.');
      } else {
        this.warn('Eksik alan girdiniz.');
      }
    } else if (res.status === -1 || res.status === 1 || res.status === 3 || res.status === 7 ||
      res.status === 8 || res.status === 9 || res.status === 12 || res.status === 13 ||
      res.status === 15 || res.status === 17 || res.status === 19 || res.status === 21 ||
      res.status === 22 || res.status === 23 || res.status === 24 || res.status === 25 ||
      res.status === 30 || res.status === 16) {
      this.warn('Beklenmeyen bir hata oluştu.');
    } else if (res.status === 4) {
      this.warn('Yetkiniz bulunmamaktadır.');
    } else if (res.status === 5) {
      this.warn('Mevcut değil');
    } else if (res.status === 6) {
      this.warn('Zaten mevcut olan bir değeri eklemek istiyorsunuz.');
    } else if (res.status == 10) {
      this.warn('Kullanıcı adı ya da Şifre hatalı');
    } else if (res.status === 11 || res.status === 14) {
      this.warn('Oturumunuz düşmüştür. Çıkıp tekrak girmelisiniz.');
    } else if (res.status === 18) {
      this.warn('Silinmiş olan bir veriyi silmek istiyorsunuz');
    } else if (res.status === 20) {
      this.warn(res.message);
    } else if (res.status === 26) {
      this.warn('Mailiniz onaylı değildir.');
    } else if (res.status === 27) {
      this.warn('Mailiniz onaylı değildir.');
    } else if (res.status === 28) {
      this.warn('Aktif olmayan bir kullanıcı ile giriş yapmayı denediniz.');
    } else if (res.status === 29) {
      this.warn('Mailiniz zaten onaylıdır.');
    } else if (res.status === 44) {
      this.warn('Yeterli bakiyeniz bulunmamaktadır.');
    } else if (res.status === 44) {
      this.warn('Alım yada Saış limitinin üzerine çıktınız. Lütfen değerleriniz kontrol ediniz.');
    } else if (res.status === 46) {
      this.warn('Bu cüzdan bizde mevcut değildir.');
    } else if (res.status === 47) {
      this.warn('Piyasanın çok üzerinde bir talepte bulundunuz. Satış emri bu sebepten dolayı gerçekleştirilmedi');
    }
  }

  success(content: string, title?: string, override?: any) {
    this._service.success(content, title, override);
  }

  warn(content: string, title?: string, override?: any) {
    this._service.warn(content, title, override);
  }

}
