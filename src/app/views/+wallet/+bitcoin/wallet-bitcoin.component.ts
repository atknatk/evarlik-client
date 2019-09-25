import {Component} from '@angular/core';

declare const $: any;

@Component({
  template: `
    <ev-wallet-coin-base coinName="Bitcoin" coinShortName="BTC" [commision]="0.0006"></ev-wallet-coin-base>`
})
export class WalletBitcoinComponent {
}
