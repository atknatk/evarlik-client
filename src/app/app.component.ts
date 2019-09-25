import { Component } from '@angular/core';

@Component({
  selector: 'evarlik-root',
  template: `
    <router-outlet></router-outlet>
    <kb-confirmations id="kb-confirmations" [defaultSettings]="confirmationsOptions"></kb-confirmations>
    <kb-notifications id="kb-notifications" [options]="options"></kb-notifications>
  `
})
export class AppComponent {
  public options = {
    position: ['top', 'right'],
    timeOut: 5000,
    lastOnBottom: true,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxStack: 5
  };
  public confirmationsOptions = {};
}
