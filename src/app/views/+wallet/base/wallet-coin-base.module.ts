import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionLogModule } from '../../../shared/component/transactionlog/transaction-log.module';
import { CurrencyMaskModule } from '../../../shared/utils/currencymask/currency-mask.module';
import { WalletCoinBaseComponent } from './wallet-coin-base.component';

const components = [
  WalletCoinBaseComponent
];


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    TransactionLogModule
  ],
  declarations: [...components],
  exports: [...components]
})

export class WalletCoinBaseModule {
}
