import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsModule } from '../../shared/layout/layout.module';
import { PersonalComponent } from './personal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyMaskModule } from '../../shared/utils/currencymask/currency-mask.module';

const routes: Routes = [{
  path: '',
  component: PersonalComponent
}];

const components = [
  PersonalComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    RouterModule.forChild(routes)
  ],
  declarations: [...components],
  exports: [...components],
})

export class PersonalModule {
}
