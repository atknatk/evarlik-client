import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HistoryChartModule } from '../../../../shared/component/chart/history-chart/history-chart.module';
import { CoinBaseModule } from '../base/coin-base.module';
import { LitecoinComponent } from './litecoin.component';

const routes: Routes = [{
  path: '',
  component: LitecoinComponent
}];

const components = [
  LitecoinComponent
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
export class LitecoinModule {
}
