import { Component } from '@angular/core';

declare const $: any;

@Component({
  template: `
    <ev-wallet-coin-base coinName="Dogecoin" coinShortName="DOGE" [commision]="2"></ev-wallet-coin-base>`
})
export class WalletDogecoinComponent {
}
