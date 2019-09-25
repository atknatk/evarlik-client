import { Component } from '@angular/core';

declare const $: any;

@Component({
  template: `
    <ev-wallet-coin-base coinName="IOTA" coinShortName="IOTA" [commision]="0.5"></ev-wallet-coin-base>`
})
export class WalletIotaComponent {
}
