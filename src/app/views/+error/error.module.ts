import { NgModule } from '@angular/core';
import { NotFoundModule } from './+not-found/not-found.module';
import { errorRouting } from './error.router';

const modules = [
  NotFoundModule,
  errorRouting
];

@NgModule({
  imports: [...modules]
})

export class ErrorModule {
}
