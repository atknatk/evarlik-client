import {Component, EventEmitter, Input, Output} from '@angular/core';
import {isNullOrUndefined, isNumber} from 'util';
import {EvHttpService} from '../../services/http/http.service';
import {EvNotificationService} from '../../services/notification/notification.service';
import {currencyTrim, multiplyFixed} from '../../utils/utils';

@Component({
  selector: 'ev-transaction-market-log',
  templateUrl: './transaction-market-log.component.html'
})
export class TransactionMarketLogComponent {
  @Input() orders = [];
  @Input() coinShortName;
  @Input() type;
  @Input() transferCommission = '0';
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

  getCommission(_commision, idTransactionType) {
    if (this.type === 'wallet') {
      return this.getTransferCommision(idTransactionType);
    } else if (this.type === 'coin') {
      return _commision;
    }
    if (isNullOrUndefined(_commision)) {
      return '-';
    }
    return _commision;
  }

  getDataAmount(coinAmount, idTransactionType, idCoinType) {
    if (this.type === 'bank') {
      return '-';
    } else if (this.type === 'all') {
      if (idTransactionType.indexOf('bank') > -1) {
        return '-';
      } else {
        return currencyTrim(coinAmount) + ' ' + idCoinType;
      }
    } else if (this.type === 'wallet') {
      return currencyTrim(coinAmount) + ' ' + this.coinShortName;
    } else if (this.type === 'coin') {
      return currencyTrim(coinAmount) + ' ' + this.coinShortName;
    }
    return currencyTrim(coinAmount);
  }

  getDataTotal(unitPrice, coinAmount, moneyAmount, idTransactionType) {
    if (this.type === 'bank') {
      return currencyTrim(moneyAmount) + ' TL';
    } else if (this.type === 'wallet') {
      return '-';
    } else if (this.type === 'all') {
      if (idTransactionType.indexOf('bank') > -1 || idTransactionType.indexOf('coin') > -1) {
        return currencyTrim(moneyAmount) + ' TL';
      } else if (idTransactionType.indexOf('wallet') > -1) {
        return '-';
      }
    } else if (this.type === 'coin') {
      return currencyTrim(multiplyFixed(unitPrice, coinAmount)) + ' TL';
    }
    return currencyTrim(multiplyFixed(unitPrice, coinAmount));
  }

  getTrace(order) {
    if (this.type === 'wallet') {
      if (!isNullOrUndefined(order.traceLink) && order.traceLink !== '') {
        return `<a target="_blank" href="${order.traceLink}">Takip</a>`;
      }
      if (order.idTransactionType === 'to_wallet') {
        return order.remoteWalletAddress;
      }
      return '-';
    }
    return order.guid;
  }

  getDataUnitPrice(unitPrice, idTransactionType) {

    if (this.type === 'wallet') {
      return '-';
    } else if (this.type === 'bank') {
      return '-';
    } else if (this.type === 'all') {
      if (idTransactionType.indexOf('bank') > -1 || idTransactionType.indexOf('wallet') > -1) {
        return '-';
      } else if (idTransactionType.indexOf('coin') > -1) {
        return currencyTrim(unitPrice) + ' TL';
      }
    } else if (this.type === 'coin') {
      return currencyTrim(unitPrice) + ' TL';
    }
    return currencyTrim(unitPrice) + ' ' + this.coinShortName;
  }

  getDate(date: string) {
    if (date) {
      const _date = new Date(date);
      const _year = _date.getFullYear().toString().substring(2);
      return `${this.getDateWithPrefix(_date.getDate())}/${this.getDateWithPrefix(_date.getMonth() + 1)}/${_year} ${this.getDateWithPrefix(_date.getHours())}:${this.getDateWithPrefix(_date.getMinutes())}`;
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
    } else if (key === 'transferring') {
      return 'Transfer Ediliyor';
    }
    return key;
  }

  getTransactionType(key, pin) {
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

  getTransferCommision(idTransactionType) {
    if (idTransactionType === 'to_wallet') {
      return this.transferCommission;
    } else if (idTransactionType === 'from_wallet') {
      return '-';
    }
    return idTransactionType;
  }

  isCompeted(transactionState: string) {
    return transactionState === 'completed' || transactionState === 'cancelled_by_user' || transactionState === 'cancelled_by_admin' || transactionState === 'transferring';
  }


  private getDateWithPrefix(value) {
    if (isNumber(value)) {
      return value < 10 ? `0${value}` : value;
    }
    return value.length === 1 ? `0${value}` : value;
  }


}
