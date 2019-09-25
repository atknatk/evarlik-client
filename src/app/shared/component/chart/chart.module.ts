import { NgModule } from '@angular/core';
import { HistoryChartModule } from './history-chart/history-chart.module';

const modules = [
  HistoryChartModule
];


@NgModule({
  declarations: [],
  imports: [...modules],
  exports: []
})

export class ChartModule {
}



