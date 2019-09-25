import { Injectable, Inject, Optional } from '@angular/core';
import {  KbLoadingConfig } from './loading.config';
import { IKbLoadingConfig } from './Iloading.config';

@Injectable()
export class KbLoadingConfigService {
    public loadingConfig: IKbLoadingConfig;

    constructor(@Optional() @Inject('loadingConfig') private config: IKbLoadingConfig) {
        this.loadingConfig = config || new KbLoadingConfig();
    }
}
