import { NgModule } from '@angular/core';
import { WalletCoinBaseModule } from '../base/wallet-coin-base.module';
import { WalletLitecoinComponent } from './wallet-litecoin.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: WalletLitecoinComponent
}];

const components = [
  WalletLitecoinComponent
];


@NgModule({
  imports: [
    WalletCoinBaseModule,
    RouterModule.forChild(routes)
  ],
  declarations: [...components],
  exports: [...components],
})

export class WalletLitecoinModule {
}
