import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TransactionLogComponent} from '../../shared/component/transactionlog/transaction-log.component';
import {EvHttpService} from '../../shared/services/http/http.service';
import {EvNotificationService} from '../../shared/services/notification/notification.service';
import {isNullOrUndefined} from "util";

declare const $: any;

@Component({
  templateUrl: './balance.component.html',
  styles: [`
    .ev_p11, .ev_d11 {
      height: 350px;
    }
  `]
})
export class BalanceComponent implements OnInit, AfterViewInit {

  user: any = {};
  bankOrderPin: any = '';
  @ViewChild('tlog') tlog: TransactionLogComponent;

  constructor(private _http: EvHttpService,
              private _nf: EvNotificationService) {
  }

  ngAfterViewInit(): void {
    $.getScript('assets/vendors/birim.input.mask.js');
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  onFromBank(value) {

    if (isNullOrUndefined(value)) {
      this._nf.warn('En az 25 TL yatırabilirsiniz');
    }

    if (value < 25) {
      this._nf.warn('En az 25 TL yatırabilirsiniz');
      return;
    }

    this._http.post({
      idTransactionType: 'from_bank',
      moneyAmount: +value
    }, 'UserCoinTransactionOrder').subscribe(res => {
      if (res.isSuccess) {
        this._nf.success('Para yatırma talebinizi aldık.');
        this.bankOrderPin = res.objectId;
        this.tlog.loadUserAllOrders();
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }

  onToBank(value) {

    if (isNullOrUndefined(value)) {
      this._nf.warn('En az 50 TL çekebilirsiniz');
    }

    if (value < 50) {
      this._nf.warn('En az 50 TL çekebilirsiniz');
      return;
    }
    this._http.post({idTransactionType: 'to_bank', moneyAmount: +value}, 'UserCoinTransactionOrder').subscribe(res => {
      if (res.isSuccess) {
        this._nf.success('Para çek talebinizi aldık.');
        this.tlog.loadUserAllOrders();
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

  private loadUserInfo() {
    this._http.get('User').subscribe(res => {
      if (res.isSuccess) {
        this.user = res.data;
      } else {
        this._nf.error('Kişi bilgileriniz alınamadı.');
      }

    });
  }

}
