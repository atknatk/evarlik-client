import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TransactionLogModule } from '../../shared/component/transactionlog/transaction-log.module';
import { OrderComponent } from './order.component';
import { orderRouting } from './order.router';


@NgModule({
  imports: [
    CommonModule,
    orderRouting,
    TransactionLogModule
  ],
  declarations: [OrderComponent],
  exports: [OrderComponent]
})

export class OrderModule {
}
