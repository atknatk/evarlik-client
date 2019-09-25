import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RippleComponent } from './ripple.component';
import { HistoryChartModule } from '../../../../shared/component/chart/history-chart/history-chart.module';
import { CoinBaseModule } from '../base/coin-base.module';

const routes: Routes = [{
  path: '',
  component: RippleComponent
}];

const components = [
  RippleComponent
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
export class RippleModule {
}
