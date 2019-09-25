import { Component } from '@angular/core';

declare const $: any;

@Component({
  template: `
    <ev-wallet-coin-base coinName="Ripple" coinShortName="XRP" [commision]="4"></ev-wallet-coin-base>`
})
export class WalletRippleComponent {
}
