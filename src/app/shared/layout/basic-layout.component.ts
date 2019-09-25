import { Component } from '@angular/core';


@Component({
  selector: 'ev-basic',
  template: `
    <!-- Wrapper-->
    <div id="layout-wrapper">

      <!-- Main page wrapper -->
      <div id="page-wrapper">

        <!-- Top navigation -->
        <ev-topnavbar></ev-topnavbar>

        <!-- Left navigation bar -->
        <ev-navigation></ev-navigation>

        <!-- Main view/routes wrapper-->
        <router-outlet></router-outlet>

        <!-- Footer -->
        <ev-footer></ev-footer>

      </div>
      <!-- End page wrapper-->
    </div>`
})
export class BasicLayoutComponent {

}
