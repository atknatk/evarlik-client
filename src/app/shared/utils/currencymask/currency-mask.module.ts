import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CurrencyMaskDirective } from './currency-mask.directive';
import { CurrencyDirective } from './currency.directive';
import { CurrencyPipe } from './currency.pipe';
import { OnlyNumberDirective } from './only-number.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CurrencyMaskDirective,
    CurrencyDirective,
    OnlyNumberDirective,
    CurrencyPipe,
  ],
  exports: [
    CurrencyMaskDirective,
    CurrencyDirective,
    OnlyNumberDirective,
    CurrencyPipe,
  ]
})
export class CurrencyMaskModule {
}
