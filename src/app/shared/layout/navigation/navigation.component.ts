import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import 'jquery-slimscroll';

declare var jQuery: any;

@Component({
  selector: 'ev-navigation',
  template: `
    <div class="b12a">
      <!-- menu baslangic -->
      <div class="b13a">
        <div class="b13b">
          <a [ngClass]="activeRoute('trade') ? 'b13c':''"
             [routerLink]="'/trade/bitcoin'" title="Hemen coin alış ve satış işlemleri yapabilirsin"><span>Coin Al/Sat</span>
            <i class="_i inf_2 b13g"></i></a>
        </div>
        <div class="b13b">
          <a [routerLink]="'/balance'"
             [ngClass]="activeRoute('balance') ? 'b13c':''"
             title="Hesabına para gönder ve al"><span>Para Yatır/Çek</span>
            <i class="_i inf_2 b13g"></i></a>
        </div>
        <div class="b13b">
          <a [routerLink]="'/wallet/bitcoin'"
             [ngClass]="activeRoute('wallet') ? 'b13c':''"
             title="Coinlerini başka hesaplara gönder ve al"><span>Coin Cüzdanı</span>
            <i class="_i inf_2 b13g"></i></a>
        </div>
      </div>
      <!--menu son -->
    </div>
  `
})

export class NavigationComponent {

  constructor(private _router: Router) {

  }

  activeRoute(routename: string): boolean {
    return this._router.url.indexOf(routename) > -1;
  }

}
