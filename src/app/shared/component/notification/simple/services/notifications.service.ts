import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NotificationEvent } from '../interfaces/notification-event.type';
import { Notification } from '../interfaces/notification.type';
import { Icons, defaultIcons } from '../interfaces/icons';

@Injectable()
export class NotificationsService {

  public icons: Icons = defaultIcons;
  private emitter: Subject<NotificationEvent> = new Subject<NotificationEvent>();

  set(notification: Notification, to: boolean): Notification {
    notification.id = notification.override && notification.override.id ?
      notification.override.id : Math.random().toString(36).substring(3);
    notification.click = new EventEmitter<{}>();
    this.emitter.next({command: 'set', notification: notification, add: to});
    return notification;
  };

  getChangeEmitter() {
    return this.emitter;
  }

  //// Access methods
  success(content: string, title?: string, override?: any): Notification {
    return this.set({
      title: title || '',
      content: content,
      type: 'success',
      icon: this.icons.success,
      override: override
    }, true);
  }

  error(content: string, title?: string, override?: any): Notification {
    return this.set({
      title: title || '',
      content: content,
      type: 'error',
      icon: this.icons.error,
      override: override
    }, true);
  }

  alert(content: string, title?: string, override?: any): Notification {
    return this.set({
      title: title || '',
      content: content,
      type: 'alert',
      icon: this.icons.alert,
      override: override
    }, true);
  }

  info(content: string, title?: string, override?: any): Notification {
    return this.set({
      title: title || '',
      content: content,
      type: 'info',
      icon: this.icons.info,
      override: override
    }, true);
  }

  warn(content: string, title?: string, override?: any): Notification {
    return this.set({
      title: title || '',
      content: content,
      type: 'warn',
      icon: this.icons.warn,
      override: override
    }, true);
  }

  bare(content: string, title?: string, override?: any): Notification {
    return this.set({title: title, content: content || '', type: 'bare', icon: 'bare', override: override}, true);
  }

  // With type method
  create(title: string, content = '', type = 'success', override?: any): Notification {
    return this.set({
      title: title,
      content: content,
      type: type,
      icon: (<any>this.icons)[type],
      override: override
    }, true);
  }

  // HTML Notification method
  html(html: any, type = 'success', override?: any): Notification {
    return this.set({html: html, type: type, icon: 'bare', override: override}, true);
  }

  // Remove all notifications method
  remove(id?: string): void {
    if (id) {
      this.emitter.next({command: 'clean', id: id});
    } else {
      this.emitter.next({command: 'cleanAll'});
    }
  }
}
