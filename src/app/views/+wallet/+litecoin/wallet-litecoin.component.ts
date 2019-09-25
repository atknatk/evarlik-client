import {Component} from '@angular/core';

declare const $: any;

@Component({
  template: `
    <ev-wallet-coin-base coinName="Litecoin" coinShortName="LTC" [commision]="0.01"></ev-wallet-coin-base>`
})
export class WalletLitecoinComponent {
}
