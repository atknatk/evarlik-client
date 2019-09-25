import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinBaseComponent } from './coin-base.component';
import { HistoryChartModule } from '../../../../shared/component/chart/history-chart/history-chart.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from '../../../../shared/utils/currencymask/currency-mask.module';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from '../../../../shared/utils/currencymask/currency-mask.config';
import {TransactionLogModule} from "../../../../shared/component/transactionlog/transaction-log.module";

const components = [
  CoinBaseComponent
];

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: false,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.'
};

@NgModule({
  imports: [
    CommonModule,
    HistoryChartModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    TransactionLogModule
  ],
  declarations: [...components],
  exports: [...components],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
})

export class CoinBaseModule {
}
