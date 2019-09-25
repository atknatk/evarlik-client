import { AfterViewInit, Component, OnDestroy } from '@angular/core';

declare var jQuery: any;

@Component({
  template: '<router-outlet></router-outlet><ev-footer></ev-footer>'
})
export class BlankLayoutComponent implements AfterViewInit, OnDestroy {

  ngAfterViewInit() {
    // jQuery('body').addClass('gray-bg');
  }

  ngOnDestroy() {
    // jQuery('body').removeClass('gray-bg');
  }
}
