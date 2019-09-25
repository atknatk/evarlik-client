import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicLayoutComponent } from './shared/layout/basic-layout.component';
import { BlankLayoutComponent } from './shared/layout/blank-layout.component';
import { ProtectedGuard } from './shared/services/http/protected.guard';
import { PublicGuard } from './shared/services/http/public.guard';
import { LoginComponent } from './views/+auth/+login/login.component';
import { CoinNavigationComponent } from './views/coinnavigation/coin-navigation.component';

export const routes: Routes = [


  {path: 'error', component: BlankLayoutComponent, loadChildren: 'app/views/+error/error.module#ErrorModule'},
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [PublicGuard],
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
  {
    path: 'personal',
    component: BlankLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/views/+personal/personal.module#PersonalModule'
      }
    ]
  },
  {
    path: 'support',
    component: BlankLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/views/+support/support.module#SupportModule'
      }
    ]
  },
  {
    path: 'price',
    component: BlankLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: 'app/views/+price/price.module#PriceModule'
      }
    ]
  },
  {
    path: 'trade', component: BasicLayoutComponent, children: [
    {
      path: '',
      canActivate: [ProtectedGuard],
      component: CoinNavigationComponent,
      children: [
        {
          path: 'bitcoin',
          loadChildren: 'app/views/+trade/coin/+bitcoin/bitcoin.module#BitcoinModule'
        },
        {
          path: 'litecoin',
          loadChildren: 'app/views/+trade/coin/+litecoin/litecoin.module#LitecoinModule'
        },
        {
          path: 'dogecoin',
          loadChildren: 'app/views/+trade/coin/+dogecoin/dogecoin.module#DogecoinModule'
        },
        {
          path: 'ripple',
          loadChildren: 'app/views/+trade/coin/+ripple/ripple.module#RippleModule'
        },
        {
          path: 'iota',
          loadChildren: 'app/views/+trade/coin/+iota/iota.module#IotaModule'
        }
      ]
    }
  ]
  },
  {
    path: 'wallet', component: BasicLayoutComponent, children: [
    {
      canActivate: [ProtectedGuard],
      path: '',
      component: CoinNavigationComponent,
      children: [
        {
          path: 'bitcoin',
          loadChildren: 'app/views/+wallet/+bitcoin/wallet-bitcoin.module#WalletBitcoinModule'
        },
        {
          path: 'litecoin',
          loadChildren: 'app/views/+wallet/+litecoin/wallet-litecoin.module#WalletLitecoinModule'
        },
        {
          path: 'dogecoin',
          loadChildren: 'app/views/+wallet/+dogecoin/wallet-dogecoin.module#WalletDogecoinModule'
        },
        {
          path: 'ripple',
          loadChildren: 'app/views/+wallet/+ripple/wallet-ripple.module#WalletRippleModule'
        },
        {
          path: 'iota',
          loadChildren: 'app/views/+wallet/+iota/wallet-iota.module#WalletIotaModule'
        }
      ]
    }
  ]
  },
  {
    path: 'balance',
    canActivate: [ProtectedGuard],
    component: BasicLayoutComponent,
    loadChildren: 'app/views/+balance/balance.module#BalanceModule'
  },
  {
    path: 'order',
    canActivate: [ProtectedGuard],
    component: BasicLayoutComponent,
    loadChildren: 'app/views/+order/order.module#OrderModule'
  },
  {path: '**', redirectTo: '/error/404'},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
