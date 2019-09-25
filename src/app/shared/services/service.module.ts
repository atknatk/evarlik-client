import { NgModule } from '@angular/core';
import { EvTokenService } from './auth/token.service';
import { EvHashId } from './hashids/hashids.service';
import { JWTInterceptor } from './http/jwt-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EvStorageService } from './storage/storage.service';
import { EvNotificationService } from './notification/notification.service';
import { EvHttpService } from './http/http.service';
import { SocketService } from './socket/socket.service';
import { CacheService } from './cache/cache.service';
import { ProtectedGuard } from './http/protected.guard';
import { PublicGuard } from './http/public.guard';
import {SubscriberService} from "./subscriber/subscriber.service";

const services = [
  EvHttpService,
  ProtectedGuard,
  PublicGuard,
  EvTokenService,
  EvStorageService,
  EvNotificationService,
  EvHashId,
  SocketService,
  CacheService,
  SubscriberService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JWTInterceptor,
    multi: true,
  },
  // KbFormBuilder
];

@NgModule({
  providers: [...services],
})
export class ServiceModule {
}
