import { NgModule } from '@angular/core';
import { routing } from './auth.router';
import { LoginModule } from './+login/login.module';

const modules = [
  LoginModule,
  routing
];

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [],
})
export class AuthModule {
}
