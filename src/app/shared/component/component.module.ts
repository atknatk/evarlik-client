import { NgModule } from '@angular/core';
import { KbConfirmationsModule } from './notification/confirmations/confirmations.module';

const modules = [
  KbConfirmationsModule
]

@NgModule({
  imports: [...modules],
  exports: [...modules],
})

export class ComponentsModule {
}
