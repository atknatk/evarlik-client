import {Component, EventEmitter, Input, Output} from '@angular/core';
import {isNumber} from 'util';
import {EvHttpService} from '../../services/http/http.service';
import {EvNotificationService} from '../../services/notification/notification.service';
import {currencyTrim, multiplyFixed} from '../../utils/utils';

@Component({
  selector: 'ev-transaction-money-log',
  templateUrl: './transaction-money-log.component.html'
})
export class TransactionMoneyLogComponent {
  @Input() orders = [];
  @Input() coinShortName;
  @Input() type;
  @Output() canceledEvent = new EventEmitter();

  constructor(private _http: EvHttpService,
              private _nf: EvNotificationService) {

  }

  cancelOrder(id, state) {
    if (!this.isCompeted(state)) {
      this._http.delete('MainOrderLog', id).subscribe((res: any) => {
        if (res.isSuccess) {
          this._nf.success('Emiriniz başarılı bir şekilde iptal edildi');
          this.canceledEvent.emit();
        } else if (res.status == 48) {
          this._nf.warn('Emiriniz işleminizin bir kısmı gerçekleştiği için iptal edilemiyor');
        } else {
          this._nf.showResultMessage(res);
        }

      });
    }
  }

  getCommision(idTransactionType) {
    if (idTransactionType === 'from_bank') {
      return '-';
    } else if (idTransactionType === 'to_bank') {
      return '2.50 TL';
    }
  }

  getDataAmount(coinAmount, idTransactionType) {
    if (this.type === 'bank') {
      return '-';
    } else if (this.type === 'all') {
      if (idTransactionType.indexOf('bank') > -1) {
        return '-';
      }
    }

    return currencyTrim(coinAmount);
  }

  getDataTotal(unitPrice, coinAmount, moneyAmount, idTransactionType) {
    if (this.type === 'bank') {
      return currencyTrim(moneyAmount) + ' TL';
    } else if (this.type === 'wallet') {
      return '-';
    }
    return currencyTrim(multiplyFixed(unitPrice, coinAmount));
  }

  getDataUnitPrice(unitPrice, idTransactionType) {

    if (this.type === 'wallet') {
      return '-';
    } else if (this.type === 'bank') {
      return '-';
    }
    return currencyTrim(unitPrice);
  }

  getDate(date: string) {
    if (date) {
      const _date = new Date(date);
      const _year = _date.getFullYear().toString().substring(2);
      return `${this.getDateWithPrefix(_date.getDate())}/${this.getDateWithPrefix(_date.getMonth() + 1)}/${_year} ${this.getDateWithPrefix(_date.getHours())}:${this.getDateWithPrefix(_date.getMinutes())}`;
    }
    return '';
  }

  getIban1(idTransactionType, iban) {
    if (idTransactionType === 'from_bank') {
      return 'TR360020500009483960600001';
    } else if (idTransactionType === 'to_bank') {
      if (iban) {
        iban = iban.replace(' ', '');
      }
      return iban;
    }
    return '';
  }

  getIban2(idTransactionType, iban) {
    if (idTransactionType === 'from_bank') {
      if (iban) {
        iban = iban.replace(' ', '');
      }
      return iban;
    } else if (idTransactionType === 'to_bank') {
      return 'TR360020500009483960600001';
    }
    return '';
  }

  getTransactionState(key) {
    if (key === 'completed') {
      return 'Tamamlandı';
    } else if (key === 'processing') {
      return 'Beklemede';
    } else if (key === 'partialy_completed') {
      return 'Kısmi Tamamlandı';
    } else if (key === 'cancelled_by_user') {
      return 'İptal edildi';
    } else if (key === 'cancelled_by_admin') {
      return 'Sistem İptali';
    }
    return key;
  }

  getTransactionType(key) {
    if (key === 'coin_purchasing') {
      return 'Coin Alımı';
    } else if (key === 'coin_sales') {
      return 'Coin Satımı';
    } else if (key === 'from_bank') {
      return 'TL Yatırma';
    } else if (key === 'to_bank') {
      return 'TL Çekme';
    } else if (key === 'from_wallet') {
      return 'Gelen Transfer';
    } else if (key === 'to_wallet') {
      return 'Giden Transfer';
    }
    return key;
  }

  isCompeted(transactionState: string) {
    return transactionState === 'completed' || transactionState === 'cancelled_by_user' || transactionState === 'cancelled_by_admin';
  }

  private getDateWithPrefix(value) {
    if (isNumber(value)) {
      return value < 10 ? `0${value}` : value;
    }
    return value.length === 1 ? `0${value}` : value;
  }


}
