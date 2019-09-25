import { RouterModule, Routes } from '@angular/router';
import { BalanceComponent } from './balance.component';

export const balanceRoutes: Routes = [
  {
    path: '', component: BalanceComponent
  }
];
export const balanceRouting = RouterModule.forChild(balanceRoutes);
