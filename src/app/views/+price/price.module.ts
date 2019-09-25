import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PriceComponent } from './price.component';
import { LayoutsModule } from '../../shared/layout/layout.module';

const routes: Routes = [{
  path: '',
  component: PriceComponent
}];


const components = [
  PriceComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [...components],
  exports: [...components],
})

export class PriceModule {
}
