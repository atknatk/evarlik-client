import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TransactionLogModule } from '../../shared/component/transactionlog/transaction-log.module';
import { CurrencyMaskModule } from '../../shared/utils/currencymask/currency-mask.module';
import { BalanceComponent } from './balance.component';
import { balanceRouting } from './balance.router';


@NgModule({
  imports: [
    CommonModule,
    balanceRouting,
    CurrencyMaskModule,
    TransactionLogModule
  ],
  declarations: [BalanceComponent],
  exports: [BalanceComponent]
})

export class BalanceModule {
}
