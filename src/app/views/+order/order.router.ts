import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';

export const orderRoutes: Routes = [
  {
    path: '', component: OrderComponent
  }
];
export const orderRouting = RouterModule.forChild(orderRoutes);
