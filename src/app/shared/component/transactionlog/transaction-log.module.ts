import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CurrencyMaskModule } from '../../utils/currencymask/currency-mask.module';
import { TransactionLogTableComponent } from './transaction-log-table.component';
import { TransactionLogComponent } from './transaction-log.component';
import {TransactionMarketLogComponent} from "./transaction-market-log.component";
import {TransactionMoneyLogComponent} from "./transaction-money-log.component";


const components = [
  TransactionLogComponent,
  TransactionLogTableComponent,
  TransactionMarketLogComponent,
  TransactionMoneyLogComponent
];

@NgModule({
  imports: [
    CommonModule,
    CurrencyMaskModule,
    RouterModule
  ],
  declarations: [...components],
  exports: [...components],
})
export class TransactionLogModule {
}
