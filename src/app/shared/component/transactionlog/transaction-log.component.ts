import {Component, Input, OnInit} from '@angular/core';
import {EvHttpService} from '../../services/http/http.service';
import {EvNotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'ev-transaction-log',
  template: `
    <br>
    <div class="i10b">
      <div class="i10c">
        <li (click)="orderType = 'Open'" class="pointer">
          <a class="i11c"
             [ngClass]="orderType === 'Open' ? '' : 'i12c'">Açık Emirleriniz</a>
        </li>
        <li (click)="orderType = 'All'" class="pointer">
          <a class="i11c"
             [ngClass]="orderType === 'All' ? '' : 'i12c'">Tüm Emirler</a>
        </li>
      </div>

      <ev-transaction-market-log *ngIf="orderType === 'Open' && type !== 'bank'"
                                 [coinShortName]="coinShortName"
                                 [orders]="openOrders"
                                 [type]="type"
                                 (canceledEvent)="loadUserAllOrders()"></ev-transaction-market-log>
      <ev-transaction-market-log *ngIf="orderType === 'All' && type !== 'bank'"
                                 [coinShortName]="coinShortName"
                                 [orders]="allOrders"
                                 [type]="type"
                                 (canceledEvent)="loadUserAllOrders()"></ev-transaction-market-log>
      
      <ev-transaction-money-log *ngIf="orderType === 'Open' && type === 'bank'"
                                [coinShortName]="coinShortName"
                                [orders]="openOrders"
                                [type]="type"
                                (canceledEvent)="loadUserAllOrders()"></ev-transaction-money-log>
      <ev-transaction-money-log *ngIf="orderType === 'All' && type === 'bank'"
                                [coinShortName]="coinShortName"
                                [orders]="allOrders"
                                [type]="type"
                                (canceledEvent)="loadUserAllOrders()"></ev-transaction-money-log>

      <div class="b60b" *ngIf="type != 'all'">
        <a href="/order">
          <div class="b50a _g2">Bütün Hesap Hareketlerimi Görüntüle</div>
        </a></div>
    </div>`
})
export class TransactionLogComponent implements OnInit {
  openOrders = [];
  allOrders = [];
  orderType = 'Open';
  @Input() coinShortName = '';
  @Input() transferCommission = '';
  @Input() type;

  constructor(private _http: EvHttpService,
              private _nf: EvNotificationService) {

  }

  cancelOrder(id, state) {
    if (!this.isCompeted(state)) {
      this._http.delete('MainOrderLog', id).subscribe((res: any) => {
        if (res.isSuccess) {
          this._nf.success('Emiriniz başarılı bir şekilde iptal edildi');
          this.loadUserAllOrders();
        } else if (res.status == 48) {
          this._nf.warn('Emiriniz işleminizin bir kısmı gerçekleştiği için iptal edilemiyor');
        } else {
          this._nf.showResultMessage(res);
        }

      });
    }
  }

  isCompeted(transactionState: string) {
    return transactionState === 'completed' || transactionState === 'cancelled_by_user';
  }

  loadUserAllOrders() {
    if (this.type === 'coin') {
      this._http.get(`MainOrderLog/CoinOrder?idCoinType=${this.coinShortName}`).subscribe(this.subscriber.bind(this));
    } else if (this.type === 'bank') {
      this._http.get(`MainOrderLog/BankOrder`).subscribe(this.subscriber.bind(this));
    } else if (this.type === 'wallet') {
      this._http.get(`MainOrderLog/WalletOrder?idCoinType=${this.coinShortName}`).subscribe(this.subscriber.bind(this));
    } else if (this.type === 'all') {
      this._http.get(`MainOrderLog/AllOrder`).subscribe(this.subscriber.bind(this));
    }
  }

  ngOnInit(): void {
    this.loadUserAllOrders();
  }

  private subscriber(result) {
    if (result.isSuccess) {
      this.allOrders = result.data;
      this.openOrders = result.data.filter(item => item.idTransactionState === 'processing' ||
        item.idTransactionState === 'partialy_completed' ||
        item.idTransactionState === 'transferring');
    } else {
      this._nf.warn('Mevcut emirleri alımınızda bir hata oluştu');
    }
  }


}
