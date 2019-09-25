import { NgModule } from '@angular/core';
import { WalletCoinBaseModule } from '../base/wallet-coin-base.module';
import { WalletIotaComponent } from './wallet-iota.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  component: WalletIotaComponent
}];
const components = [
  WalletIotaComponent
];


@NgModule({
  imports: [
    WalletCoinBaseModule,
    RouterModule.forChild(routes),

  ],
  declarations: [...components],
  exports: [...components],
})

export class WalletIotaModule {
}
