import { NgModule } from '@angular/core';
import { HistoryChartComponent } from './history-chart.component';

const comps = [
  HistoryChartComponent
];


@NgModule({
  declarations: [...comps],
  imports: [],
  exports: [...comps]
})

export class HistoryChartModule {
}
