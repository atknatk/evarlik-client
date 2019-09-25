import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionLogComponent } from '../../../../shared/component/transactionlog/transaction-log.component';
import { CacheService } from '../../../../shared/services/cache/cache.service';
import { EvHttpService } from '../../../../shared/services/http/http.service';
import { EvNotificationService } from '../../../../shared/services/notification/notification.service';
import { SocketService } from '../../../../shared/services/socket/socket.service';
import { SubscriberService } from '../../../../shared/services/subscriber/subscriber.service';
import { currencyTrim, multiplyFixed } from '../../../../shared/utils/utils';

declare const $: any;

@Component({
  selector: 'ev-coin-base',
  templateUrl: './coin-base.component.html',
  animations: [
    trigger('growShrinkStaticStart', [
      state('in', style({
        height: '*',
        'padding-top': '*',
        'padding-bottom': '*',
        'margin-top': '*',
        'margin-bottom': '*'
      })),
      transition('* => void', [
        style({height: '*', 'padding-top': '*', 'padding-bottom': '*', 'margin-top': '*', 'margin-bottom': '*'}),
        animate('0.5s ease', style({
          height: '0',
          'padding-top': '0',
          'padding-bottom': '0',
          'margin-top': '0',
          'margin-bottom': '0',
          'background-color': 'yellow'
        }))
      ]),
      transition('void => false', [
        /*no transition on first load*/
      ]),
      transition('void => *', [
        style({height: '0', 'padding-top': '0', 'padding-bottom': '0', 'margin-top': '0', 'margin-bottom': '0'}),
        animate('0.5s ease', style({
          height: '*',
          'padding-top': '*',
          'padding-bottom': '*',
          'margin-top': '*',
          'margin-bottom': '*',
          'background-color': '*'
        }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CoinBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() coinName;
  @Input() coinShortName;
  moneyBalance = 0;
  salesOrderList = [];
  purchasingOrderList = [];
  salesOrderForm: FormGroup;
  purchasingOrderForm: FormGroup;
  isProgressing = false;
  allCoinBalance = [];
  animationInitialized = false;
  @ViewChild('tlog') tlogComponent: TransactionLogComponent;
  lock = {
    purchasingUnitPrice: false,
    purchasingTotalPrice: false,
    salesUnitPrice: false,
    salesTotalPrice: false,
  };

  constructor(private _http: EvHttpService,
              private _fb: FormBuilder,
              private _nf: EvNotificationService,
              private _cache: CacheService,
              private _subscriber: SubscriberService,
              private _socket: SocketService) {
    if (this._cache.isExist('allCoinBalance')) {
      this.allCoinBalance = this._cache.getValue('allCoinBalance');
    }
    this._cache.setValueEvent('allCoinBalance', this.getCoinValue.bind(this));
  }

  getCoinValue(value?): number {
    if (value) {
      this.allCoinBalance = value;
    }
    const filtered = this.allCoinBalance.filter(item => item.idCoinType === this.coinShortName);
    if (filtered.length === 1) {
      return +currencyTrim(filtered[0].balance);
    }
    return 0.0;
  }

  getOrderPub(value) {
    if (value.coinAmount == 0) {
      return;
    }
    let listName = '';
    if (value.idTransactionType === 'coin_purchasing') {
      listName = 'purchasingOrderList';
    } else if (value.idTransactionType === 'coin_sales') {
      listName = 'salesOrderList';
    } else {
      return;
    }

    let removeIndex = -1;
    let isDiff = true;
    for (let i = 0; i < this[listName].length; i++) {
      if (this[listName][i].coinUnitPrice == value.coinUnitPrice) {
        if (this[listName][i].coinAmount + value.coinAmount == 0) {
          removeIndex = i;
        } else {
          this[listName][i].coinAmount += value.coinAmount;
        }
        isDiff = false;
        break;
      }
    }
    if (removeIndex != -1) {
      this[listName].splice(removeIndex, 1);
    }
    if (isDiff) {
      this[listName].push(value);
      if (listName === 'purchasingOrderList') {
        this[listName].sort(function (a, b) {
          return b.coinUnitPrice - a.coinUnitPrice;
        });
      } else {
        this[listName].sort(function (a, b) {
          return a.coinUnitPrice - b.coinUnitPrice;
        });
      }
    }
  }

  getRowClass(listName, amount) {
    return 'row-changed';
  }

  initCoinTransactionLogOrder(orderTpye: string) {
    this._http.get('UserCoinTransactionOrder/List?' +
      'transactionType=' + orderTpye + '&coinType=' + this.coinShortName + '&limit=' + 30)
      .subscribe(res => {
        let val;
        if (res.isSuccess) {
          val = res.data;
        } else {
          val = [];
        }
        this[orderTpye.split('_')[1] + 'OrderList'].push(...val);
      });
  }

  initMoneyBalance() {
    this._http.get('UserCoinTransactionOrder/MoneyBalance').subscribe(res => {
      if (res.isSuccess) {
        this.moneyBalance = +res.data;
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  inputBlurClick(e) {
    if (e.target.value == '') {
      e.target.value = 0;
    }
  }

  inputFocusClick(e) {
    if (+e.target.value == 0) {
      e.target.value = '';
    }
  }

  multiply(value1: any, value2: any): number {
    return multiplyFixed(value1, value2);
  }

  ngAfterViewInit(): void {
    $.getScript('assets/vendors/birim.input.mask.js');
  }

  ngOnDestroy(): void {
    this._socket.getOrderHub(hub => {
      if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
        hub.server.unsubscribe(this.coinShortName);
      }
    });
  }

  ngOnInit(): void {
    //  this._cd.reattach();
    this._socket.subscribeOrder(this.getOrderPub.bind(this));
    this._socket.getOrderHub(hub => {
      if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected) {
        hub.server.subscribe(this.coinShortName);
      } else {
        // this._socket.onConnected(hub.server.subscribe.bind(this));
      }
    });
    this.salesOrderForm = this.getOrderForm('sales');
    this.purchasingOrderForm = this.getOrderForm('purchasing');
    this.initCoinTransactionLogOrder('coin_purchasing');
    this.initCoinTransactionLogOrder('coin_sales');
    this.initMoneyBalance();
  }

  onPurchasingOrderTable(order) {
    this.salesOrderForm.patchValue({
      coinUnitPrice: currencyTrim(order.coinUnitPrice),
      coinAmount: currencyTrim(order.coinAmount),
      totalAmount: currencyTrim(this.multiply(currencyTrim(order.coinAmount), currencyTrim(order.coinUnitPrice)))
    });

  }

  onSalesOrderTable(order) {
    this.purchasingOrderForm.patchValue({
      coinUnitPrice: currencyTrim(order.coinUnitPrice),
      coinAmount: currencyTrim(order.coinAmount),
      totalAmount: currencyTrim(this.multiply(currencyTrim(order.coinUnitPrice), currencyTrim(order.coinAmount)))
    });
    this.lock.purchasingUnitPrice = true;
    this.lock.purchasingTotalPrice = false;
  }

  purchasingOrder() {
    if (!this.validateValue(this.purchasingOrderForm)) {
      return;
    }
    this.isProgressing = true;
    const formValue = this.purchasingOrderForm.getRawValue();
    const data = {
      idTransactionType: 'coin_purchasing',
      idCoinType: this.coinShortName,
      coinAmount: formValue.coinAmount,
      coinUnitPrice: formValue.coinUnitPrice
    };

    this._http.post(data, 'UserCoinTransactionOrder').subscribe(res => {
      this.isProgressing = false;
      if (res.isSuccess) {
        this._nf.success('İşleminiz başarılı bir şekilde gerçekleşti.');
        this._subscriber.emit('coin_balance');
        this.initMoneyBalance();
        if (this.tlogComponent) {
          this.tlogComponent.loadUserAllOrders();
        }
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  salesOrder() {
    if (!this.validateValue(this.salesOrderForm)) {
      return;
    }
    this.isProgressing = true;
    const formValue = this.salesOrderForm.getRawValue();

    this.isProgressing = true;
    const data = {
      idTransactionType: 'coin_sales',
      idCoinType: this.coinShortName,
      coinAmount: formValue.coinAmount,
      coinUnitPrice: formValue.coinUnitPrice
    };

    this._http.post(data, 'UserCoinTransactionOrder').subscribe(res => {
      this.isProgressing = false;
      if (res.isSuccess) {
        this._nf.success('İşleminiz başarılı bir şekilde gerçekleşti.');
        this._subscriber.emit('coin_balance');
        this.initMoneyBalance();
        if (this.tlogComponent) {
          this.tlogComponent.loadUserAllOrders();
        }
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  selectPurchasingAllBalance() {
    const unitPrice = this._cache.getValue(this.coinShortName);
    const unit = unitPrice && unitPrice.coinUnitPrice ? unitPrice.coinUnitPrice : 0;
    console.log(unitPrice);
    this.purchasingOrderForm.patchValue({
      totalAmount: this.moneyBalance,
      coinUnitPrice: unit == 0 ? 0 : currencyTrim(unit),
      coinAmount: unit == 0 ? 0 : currencyTrim(this.moneyBalance / unit)
    }, {emitEvent: false});
    if (!this.lock.purchasingTotalPrice) {
      this.toggleLock('purchasingTotalPrice');
    }
  }

  selectSalesAllCoin() {
    const unitPrice = this._cache.getValue(this.coinShortName);
    const unit = unitPrice && unitPrice.coinUnitPrice ? currencyTrim(unitPrice.coinUnitPrice) : 0;
    this.salesOrderForm.patchValue({
      coinAmount: this.getCoinValue(),
      coinUnitPrice: unit == 0 ? 0 : currencyTrim(unit),
    });
    if (!this.lock.salesTotalPrice) {
      this.toggleLock('salesTotalPrice');
    }
  }

  toggleLock(data: string) {
    this.lock[data] = !this.lock[data];
    if (data === 'purchasingUnitPrice' && this.lock[data]) {
      this.lock.purchasingTotalPrice = false;
    } else if (data === 'purchasingTotalPrice' && this.lock[data]) {
      this.lock.purchasingUnitPrice = false;
    } else if (data === 'salesUnitPrice' && this.lock[data]) {
      this.lock.salesTotalPrice = false;
    } else if (data === 'salesTotalPrice' && this.lock[data]) {
      this.lock.salesUnitPrice = false;
    }
  }

  validateValue(form: FormGroup): boolean {
    const formValue = form.getRawValue();
    if (this.isProgressing) {
      this._nf.warn('Lütfen mevcut işleminizin bitmesini bekleyiniz.');
      return false;
    }
    /*    if (formValue.coinUnitPrice) {
          this._nf.warn('Lütfen tüm alanları doldurunuz.');
          return false;
        }*/

    if (formValue.coinUnitPrice == 0) {
      this._nf.warn('Fiyat 0 olamaz.');
      return false;
    }

    if (formValue.coinAmount == 0) {
      this._nf.warn('Miktar 0 olamaz.');
      return false;
    }
    return true;
  }

  private getOrderForm(orderType) {
    const fg = this._fb.group({
      coinUnitPrice: [[0.00], Validators.required],
      coinAmount: [[0.00], Validators.required],
      totalAmount: [[0.00]]
    });

    fg.get('coinUnitPrice').valueChanges.subscribe(unit => {
      const coinAmount = fg.get('coinAmount').value * 1;
      const numberUnit = unit * 1;
      // const sonuc = +((+(coinAmount * numberUnit).toFixed(8)));
      const sonuc = this.multiply(currencyTrim(coinAmount), currencyTrim(numberUnit));

      fg.get('totalAmount').setValue(currencyTrim(sonuc));
    });

    fg.get('coinAmount').valueChanges.subscribe(amount => {
      const unit = fg.get('coinUnitPrice').value * 1;
      const coinAmount = amount * 1;
      // const sonuc = +((+(coinAmount * unit).toFixed(8)));
      const sonuc = this.multiply(currencyTrim(unit), currencyTrim(coinAmount));
      fg.get('totalAmount').setValue(currencyTrim(sonuc));
    });

    /* if (orderType === 'purchasing') {
       fg.get('coinUnitPrice').valueChanges.subscribe(value => {
         if (this.lock[orderType + 'TotalPrice']) {
           const total = fg.get('totalAmount').value;
           if (value != 0 && !isNaN(value)) {
             fg.get('coinAmount').setValue(Number(total / +value).toFixed(4), {emitEvent: false});
           } else {
             fg.get('coinAmount').setValue(0, {emitEvent: false});
           }
         }
       });


       fg.get('coinAmount').valueChanges.subscribe(value => {
         if (this.lock[orderType + 'TotalPrice']) {
           const total = fg.get('totalAmount').value;
           if (value != 0 && !isNaN(value)) {
             fg.get('coinUnitPrice').setValue(Number(total / +value).toFixed(4), {emitEvent: false});
           } else {
             fg.get('coinUnitPrice').setValue(0, {emitEvent: false});
           }
         } else if (this.lock[orderType + 'UnitPrice']) {
           const unit = fg.get('coinUnitPrice').value;
           if (!isNaN(value)) {
             fg.get('totalAmount').setValue(Number(unit * +value).toFixed(4), {emitEvent: false});
           } else {
             fg.get('totalAmount').setValue(0, {emitEvent: false});
           }
         }
       });


       fg.get('totalAmount').valueChanges.subscribe(total => {
         if (this.lock[orderType + 'UnitPrice']) {
           const unitPrice = fg.get('coinUnitPrice').value;
           if (unitPrice === 0) {
             fg.get('coinAmount').setValue(0);
           } else {
             fg.get('coinAmount').setValue(Number(total / +unitPrice).toFixed(8), {emitEvent: false});
           }
           /!*  if (value != 0 && !isNaN(value)) {
               fg.get('coinAmount').setValue(Number(total / +value).toFixed(4), {emitEvent: false});
             } else {
               fg.get('coinAmount').setValue(0, {emitEvent: false});
             }*!/
         }
       });

     }
 */

    return fg;
  }

}
