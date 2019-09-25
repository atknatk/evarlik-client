import { NgModule } from '@angular/core';
import { WalletBitcoinComponent } from './wallet-bitcoin.component';
import { WalletCoinBaseModule } from '../base/wallet-coin-base.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: WalletBitcoinComponent
}];


const components = [
  WalletBitcoinComponent
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    WalletCoinBaseModule
  ],
  declarations: [...components],
  exports: [...components],
})

export class WalletBitcoinModule {
}
