import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoinNavigationComponent } from './coin-navigation.component';
import { CurrencyMaskModule } from '../../shared/utils/currencymask/currency-mask.module';

const components = [
  CoinNavigationComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CurrencyMaskModule
  ],
  declarations: [...components],
  exports: [...components],
})

export class CoinNavigationModule {
}
