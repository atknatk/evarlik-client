import { NgModule } from '@angular/core';
import { ServiceModule } from './services/service.module';
import { CurrencyMaskModule } from './utils/currencymask/currency-mask.module';

const modules = [
  ServiceModule,
  CurrencyMaskModule
];

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {
}
