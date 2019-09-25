import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IotaComponent } from './iota.component';
import { HistoryChartModule } from '../../../../shared/component/chart/history-chart/history-chart.module';
import { CoinBaseModule } from '../base/coin-base.module';

const routes: Routes = [{
  path: '',
  component: IotaComponent
}];

const components = [
  IotaComponent
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
export class IotaModule {
}
