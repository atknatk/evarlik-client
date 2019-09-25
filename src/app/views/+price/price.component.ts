import { Component, OnInit } from '@angular/core';
import { EvHttpService } from '../../shared/services/http/http.service';
import { coinType } from '../coinnavigation/coin.enum';

@Component({
  templateUrl: './price.component.html'
})
export class PriceComponent implements OnInit {

  commision = {
    BTC: [],
    XRP: [],
    LTC: [],
    IOTA: [],
    DOGE: []
  }

  constructor(private _http: EvHttpService) {

  }

  ngOnInit(): void {
    this._http.get('Commission/All').subscribe(res => {
      if (res.isSuccess) {
        this.commision = {
          BTC: res.data.filter(item => item.idCoinType === coinType.btc),
          XRP: res.data.filter(item => item.idCoinType === coinType.xrp),
          LTC: res.data.filter(item => item.idCoinType === coinType.ltc),
          IOTA: res.data.filter(item => item.idCoinType === coinType.iota),
          DOGE: res.data.filter(item => item.idCoinType === coinType.doge),
        };
      }
    });
  }

}
