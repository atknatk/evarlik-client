import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from './shared/layout/layout.module';
import { ChartModule } from './shared/component/chart/chart.module';
import { HttpClientModule } from '@angular/common/http';
import { KbSimpleNotificationsModule } from './shared/component/notification/simple/simple-notifications.module';
import { ANIMATION_TYPES } from './shared/component/loading/loading-animation-type';
import { KbLoadingModule } from './shared/component/loading/loading.module';
import { ComponentsModule } from './shared/component/component.module';
import { SharedModule } from './shared/shared.module';
import { SocketService } from './shared/services/socket/socket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WalletCoinBaseModule } from './views/+wallet/base/wallet-coin-base.module';
import { CoinNavigationModule } from './views/coinnavigation/coin-navigation.module';
import { LoginModule } from './views/+auth/+login/login.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    ChartModule,
    HttpClientModule,
    ComponentsModule,
    SharedModule,
    KbSimpleNotificationsModule.forRoot(),
    LoginModule,
    CoinNavigationModule,
    WalletCoinBaseModule,
    KbLoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      primaryColour: '#fed700',
      secondaryColour: '#5fba7d',
      tertiaryColour: '#4484c1',
      backdropBackgroundColour: 'rgba(0, 0, 0, 0.4)'
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(_socket: SocketService) {
  }
}
