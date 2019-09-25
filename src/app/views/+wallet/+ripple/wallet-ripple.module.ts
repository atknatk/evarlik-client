import { NgModule } from '@angular/core';

import { WalletCoinBaseModule } from '../base/wallet-coin-base.module';
import { WalletRippleComponent } from './wallet-ripple.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: WalletRippleComponent
}];


const components = [
  WalletRippleComponent
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    WalletCoinBaseModule
  ],
  declarations: [...components],
  exports: [...components],
})

export class WalletRippleModule {
}
