import {
  Component,
  OnInit,
  ViewContainerRef,
  OnDestroy,
  Input,
  ReflectiveInjector,
  ComponentFactoryResolver,
  ViewChild
} from '@angular/core';
import { KbConfirmationService } from './confirmations.service';
import { KbConfirmationComponent } from './confirmation.component';
import { KbConfirmSettings } from './interfaces/confirm-settings';
import { KbResolveEmit } from './interfaces/resolve-emit';

@Component({
  selector: 'kb-confirmations',
  entryComponents: [KbConfirmationComponent],
  template: `
    <div #comp></div>`
})
export class KbConfirmationsComponent implements OnInit, OnDestroy {
  @ViewChild('comp', {read: ViewContainerRef}) compViewContainerRef: ViewContainerRef;
  settings: KbConfirmSettings | any = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: true,
    confirmText: 'Yes',
    declineText: 'No',
    showInputText: false
  };
  private _current: any;
  private _lastResolve: any;
  private _listener: any;

  constructor(private _service: KbConfirmationService,
              private _resolver: ComponentFactoryResolver) {
  }

  @Input()
  set defaultSettings(settings: KbConfirmSettings) {
    this.settings = {...this.settings, ...settings};
  }

  ngOnDestroy() {
    if (this._listener) {
      this._listener.unsubscribe();
    }
  }

  ngOnInit() {

    this._listener = this._service.confirmation$.subscribe((alert: any) => {
      if (this._current) {
        this._handleResolve();
      }

      if (!alert.close) {

        const settingsFinalAsArray = [];
        const settingFinalAsObj: any = {};

        for (const key in this.settings) {
          if (this.settings.hasOwnProperty(key)) {
            const toUse = alert.override[key] !== undefined ? alert.override[key] : this.settings[key];
            settingsFinalAsArray.push({key: key, value: toUse});
            settingFinalAsObj[key] = toUse;
          }
        }

        const inputProviders = [
          {key: 'message', value: alert.message},
          {key: 'title', value: alert.title},
          {key: 'resolve', value: alert.resolve$},
          ...settingsFinalAsArray
        ].map((input) => {
          return {provide: input.key, useValue: input.value};
        });
        const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
        const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.compViewContainerRef.parentInjector);
        const factory = this._resolver.resolveComponentFactory(KbConfirmationComponent);
        const component = factory.create(injector);

        this._lastResolve = alert.resolve$.subscribe((res: any) => this._handleResolve(res));

        this.compViewContainerRef.insert(component.hostView);

        this._current = component;
      }
    });
  }

  private _handleResolve(res?: KbResolveEmit) {
    this._current.destroy();
    this._lastResolve.unsubscribe();
  }
}
