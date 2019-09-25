import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import { NotificationsService } from './services/notifications.service';
import { MaxPipe } from './pipes/max.pipe';
import { KbNotificationComponent } from './components/notification.component';
import { KbSimpleNotificationsComponent } from './components/simple-notifications.component';


@NgModule({
    providers: [NotificationsService],
    imports: [
      CommonModule
  ],
  declarations: [
      KbSimpleNotificationsComponent,
      KbNotificationComponent,
      MaxPipe
  ],
  exports: [KbSimpleNotificationsComponent]
})
export class KbSimpleNotificationsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: KbSimpleNotificationsModule,
    };
  }
}
