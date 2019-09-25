import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { BasicLayoutComponent } from './basic-layout.component';
import { BlankLayoutComponent } from './blank-layout.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TopNavbarComponent } from './topnavbar/topnavbar.component';

const comps = [
  FooterComponent,
  BasicLayoutComponent,
  BlankLayoutComponent,
  NavigationComponent,
  TopNavbarComponent,
];


@NgModule({
  declarations: [...comps],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [...comps]
})

export class LayoutsModule {
}
