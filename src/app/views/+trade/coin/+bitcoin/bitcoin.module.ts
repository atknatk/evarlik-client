import { NgModule } from '@angular/core';
import { BitcoinComponent } from './bitcoin.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HistoryChartModule } from '../../../../shared/component/chart/history-chart/history-chart.module';
import { CoinBaseModule } from '../base/coin-base.module';

const routes: Routes = [{
  path: '',
  component: BitcoinComponent
}];

const components = [
  BitcoinComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HistoryChartModule,
    CoinBaseModule
  ],
  declarations: [...components],
  exports: [...components],
})
export class BitcoinModule {
}
