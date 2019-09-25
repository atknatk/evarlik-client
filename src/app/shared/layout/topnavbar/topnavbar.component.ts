import { Component, OnInit } from '@angular/core';
import { EvStorageService } from '../../services/storage/storage.service';
import { evarlikConfig } from '../../evarlik.config';
import { Router } from '@angular/router';
import { EvTokenService } from '../../services/auth/token.service';

declare var jQuery: any;

@Component({
  selector: 'ev-topnavbar',
  template: `
    <div class="b11a _g2">
      <div class="b12a">
        <a class="b12z" [routerLink]="isAuthorized() ? '/trade/bitcoin' : '/'" style=" text-decoration: none;">
          <img class="small-logo">
        </a>
        <div class="b12b"
             style="cursor: pointer"
             [routerLink]="isAuthorized() ? '/trade/bitcoin' : '/'">Evarlık Borsası
        </div>
        <div class="b12c" *ngIf="isAuthorized()">
          <a routerLink="/personal" title="Kişisel Bilgilerini ve Onaylanmış Belgelerini Görüntüle">{{name}}</a>
          <a routerLink="/personal" title="Kişisel Bilgilerini Değiştir">
            <i class="_i settings_gri s"></i>
          </a>
          <a href="javascript:void(0)" (click)="logout()" title="Çıkış Yap">
            <i class="_i cikis"></i>
          </a>
        </div>
      </div>
    </div>
  `
})
export class TopNavbarComponent implements OnInit {
  name;

  constructor(private _storage: EvStorageService,
              private _token: EvTokenService,
              private _route: Router) {

  }

  ngOnInit(): void {
    if (this._token.isAuthorized()) {
      const user = this._storage.getItem(evarlikConfig.authUserKey);
      this.name = user.name.charAt(0).toLocaleUpperCase() + user.name.slice(1) + ' ' +
        user.surname.charAt(0).toLocaleUpperCase() + user.surname.slice(1) + ' ';
    }
    window.scrollTo(0, 0);
  }


  logout() {
    this._token.clearToken();
    this._route.navigate(['/']);
  }

  isAuthorized() {
    return this._token.isAuthorized();
  }

}
