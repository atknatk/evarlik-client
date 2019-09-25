import {NgModule} from '@angular/core';
import { NotificationsService } from './services/notifications.service';


@NgModule({
    providers: [NotificationsService],
    exports: []
})
export class KbPushNotificationsModule {}
