import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {KbConfirmSettings} from './interfaces/confirm-settings';
import {KbConfirmEmit} from './interfaces/confirm-emit';
import {KbResolveEmit} from './interfaces/resolve-emit';

@Injectable()
export class KbConfirmationService {
  confirmation$ = new Subject<KbConfirmEmit>();

  create(title: string, message: string, override: KbConfirmSettings = {}) {
    const resolve$ = new Subject<KbResolveEmit>();

    this.confirmation$.next({
      title,
      message,
      resolve$,
      override
    });

    return resolve$;
  }
}
