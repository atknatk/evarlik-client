import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SupportComponent } from './support.component';
import { LayoutsModule } from '../../shared/layout/layout.module';

const routes: Routes = [{
  path: '',
  component: SupportComponent
}];


const components = [
  SupportComponent
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

export class SupportModule {
}
