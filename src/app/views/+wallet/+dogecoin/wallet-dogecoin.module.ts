import { NgModule } from '@angular/core';
import { WalletCoinBaseModule } from '../base/wallet-coin-base.module';
import { WalletDogecoinComponent } from './wallet-dogecoin.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: WalletDogecoinComponent
}];


const components = [
  WalletDogecoinComponent
];


@NgModule({
  imports: [
    WalletCoinBaseModule,
    RouterModule.forChild(routes),
  ],
  declarations: [...components],
  exports: [...components],
})

export class WalletDogecoinModule {
}
