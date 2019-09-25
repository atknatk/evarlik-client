import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EvHttpService } from '../../services/http/http.service';
import { EvNotificationService } from '../../services/notification/notification.service';
import { currencyTrim } from '../../utils/utils';

@Component({
  selector: 'ev-transaction-log-table',
  templateUrl: './transaction-market-log.component.html'
})
export class TransactionLogTableComponent {
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
    } else if (this.type === 'all') {
      if (idTransactionType.indexOf('bank') > -1) {
        return currencyTrim(moneyAmount) + ' TL';
      } else if (idTransactionType.indexOf('wallet') > -1) {
        return '-';
      }
    }
    return currencyTrim(unitPrice * coinAmount);
  }

  getDataUnitPrice(unitPrice, idTransactionType) {

    if (this.type === 'wallet') {
      return '-';
    }
    if (this.type === 'bank') {
      return '-';
    }
    if (this.type === 'all') {
      if (idTransactionType.indexOf('bank') > -1 || idTransactionType.indexOf('wallet') > -1) {
        return '-';
      }
    }
    return currencyTrim(unitPrice);
  }

  getDate(date: string) {
    if (date) {
      const _date = new Date(date);
      return `${_date.getDate()}/${(_date.getMonth() + 1)}/${_date.getFullYear()}`;
      // return `${_date.getDate()}/${(_date.getMonth() + 1)}/${_date.getFullYear()} ${_date.getHours()}:${_date.getMinutes()}`;
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
    }
    return key;
  }

  getTransactionType(key, pin) {
    if (key === 'coin_purchasing') {
      return 'Coin Alımı';
    } else if (key === 'coin_sales') {
      return 'Coin Satımı';
    } else if (key === 'from_bank') {
      return 'TL Yatırma - Pin:' + pin;
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
    return transactionState === 'completed' || transactionState === 'cancelled_by_user';
  }
}
