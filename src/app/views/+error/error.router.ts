import { RouterModule, Routes } from '@angular/router';

export const errorRoutes: Routes = [
  {
    path: '404',
    loadChildren: './+not-found/not-found.module#NotFoundModule'
  }
];
export const errorRouting = RouterModule.forChild(errorRoutes);
