import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from 'util';
import {TransactionLogComponent} from '../../../shared/component/transactionlog/transaction-log.component';
import {CacheService} from '../../../shared/services/cache/cache.service';
import {EvHttpService} from '../../../shared/services/http/http.service';
import {EvNotificationService} from '../../../shared/services/notification/notification.service';

declare const $: any;
declare const QRCode: any;

@Component({
  selector: 'ev-wallet-coin-base',
  templateUrl: './wallet-coin-base.component.html'
})
export class WalletCoinBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() coinName;
  @Input() coinShortName;
  @Input() commision = 0;
  @ViewChild('tlog') tlog: TransactionLogComponent;
  walletNumberArr = [];
  isCreateWallet = false;
  toTransferForm: FormGroup;
  private allCoinBalance = [];
  private qrcode;


  constructor(private _http: EvHttpService,
              private _cache: CacheService,
              private _fb: FormBuilder,
              private _nf: EvNotificationService) {
    if (this._cache.isExist('allCoinBalance')) {
      this.allCoinBalance = this._cache.getValue('allCoinBalance');
    }
    this._cache.setValueEvent('allCoinBalance', this.getCoinValue.bind(this));

  }

  _walletNumber;

  get walletNumber() {
    return this._walletNumber;
  }


  ngAfterViewInit(): void {
    $.getScript('assets/vendors/birim.input.mask.js');
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



  set walletNumber(number) {
    this._walletNumber = number;
    if (!isNullOrUndefined(number) && number != '') {
      this.walletNumberArr = number.match(/.{1,4}/g);
    } else {
      this.walletNumberArr = [];
    }
  }

  allAmount() {
    this.toTransferForm.patchValue({amount: this.getCoinValue()});
  }

  copyToClipboard() {
    let text = '';
    $('.wallet-numbers').each((i, v) => {
      text += $(v).text();
    });
    const $temp = $('<input>');
    $('body').append($temp);
    $temp.val(text).select();
    document.execCommand('copy');
    $temp.remove();
    this._nf.success('Cüzdanınız kopyalandı');
  }

  createWallet() {
    this.createWalletSubscribe().subscribe();
  }


  createWalletSubscribe(): Observable<boolean> {
    return this._http.post({idCoinType: this.coinShortName}, 'User/Wallet?idCoinType=' + this.coinShortName).map(res => {
      if (res.isSuccess) {
        this.walletNumber = res.data && res.data['address'];
        this.isCreateWallet = false;
        this.makeCode();
      } else {
        this._nf.showResultMessage(res);
      }
      return res.isSuccess;
    });
  }


  fromToWallet() {
    if (isNullOrUndefined(this.walletNumber)) {
      this.createWalletSubscribe().subscribe(result => {
        if (result === true) {
          this.fromToWalletSubscribe().subscribe();
        }
      });
    } else {
      this.fromToWalletSubscribe().subscribe();
    }
  }

  fromToWalletSubscribe() {
    return this._http.post({
      idTransactionType: 'from_wallet',
      toWalletAddress: this.walletNumber,
      idCoinType: this.coinShortName,
    }, 'UserCoinTransactionOrder').map(res => {
      if (res.isSuccess) {
        this._nf.success('Coin alma transferiniz kontrol ediliyor.');
        this.tlog.loadUserAllOrders();
      } else if (res.status === 6) {
        this._nf.success('Transferiniz halen devam etmektedir.');
      } else {
        this._nf.showResultMessage(res);
      }
      return res.isSuccess;
    });
  }

  getCoinValue(value?): number {
    if (value) {
      this.allCoinBalance = value;
    }
    const filtered = this.allCoinBalance.filter(item => item.idCoinType === this.coinShortName);
    if (filtered.length === 1) {
      return filtered[0].balance.toFixed(4);
    }
    return +(0.0000).toFixed(4);
  }

  makeCode() {
    this.qrcode.makeCode(this.walletNumber);
    setTimeout(() => $('#qrcode > img').css('display', 'initial'), 10);
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.toTransferForm = this._fb.group({
      wallet: '',
      amount: 0
    });
    this.qrcode = new QRCode('qrcode', {
      width: 160,
      height: 160,
      useSVG: false
    });
    this.getWallet();
  }

  onToWallet(wallet, amount) {
    if (isNullOrUndefined(amount) || amount == '' || amount == 0) {
      this._nf.warn('Göndermek istediğiniz miktarı giriniz.');
      return;
    }
    if (isNullOrUndefined(wallet) || wallet == '') {
      this._nf.warn('Göndermek istediğiniz cüzdanı giriniz.');
      return;
    }

    if (isNullOrUndefined(this.walletNumber)) {
      this.createWalletSubscribe().subscribe(result => {
        if (result === true) {
          this.onToWalletSubscribe(wallet, amount).subscribe();
        }
      });
    } else {
      this.onToWalletSubscribe(wallet, amount).subscribe();
    }
  }


  onToWalletSubscribe(wallet, amount) {
    return this._http.post({
      idTransactionType: 'to_wallet',
      toWalletAddress: wallet,
      idCoinType: this.coinShortName,
      fromWalletAddress: this.walletNumber,
      coinAmount: amount
    }, 'UserCoinTransactionOrder').map(res => {
      if (res.isSuccess) {
        this._nf.success('Coin gönderme talebi alınmıştır.');
        this.tlog.loadUserAllOrders();
      } else {
        this._nf.showResultMessage(res);
      }
      return res.isSuccess;
    });
  }

  private getTranferFee(coinType) {
    const fees = {
      BTC: 0.0006,
      LTC: 0.01,
      IOTA: 0.5,
      XRP: 4,
      DOGE: 2
    };
    return fees[coinType];
  }

  private getWallet() {
    this._http.get('User/Wallet?idCoinType=' + this.coinShortName).subscribe(res => {
      if (res.isSuccess) {
        this.walletNumber = res.data['address'];
        this.makeCode();
      } else if (res.status == 46) {
        this.isCreateWallet = true;
      } else {
        this._nf.showResultMessage(res);
      }
    });
  }
}
