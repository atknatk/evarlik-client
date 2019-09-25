import { isNullOrUndefined } from 'util';
import { KbLoadingBase } from '../../component/loading/loading.base';

export interface IKbHttpExtraConfig {
  useApi?: boolean;
  useToken?: boolean;
  useMap?: boolean;
  id?: number;
  loadingBase?: KbLoadingBase;

  [key: string]: string | boolean | number | KbLoadingBase | undefined;
}

export class KbHttpExtraConfig implements IKbHttpExtraConfig {
  useApi?: boolean;
  useToken?: boolean;
  useMap?: boolean;
  id?: number;
  loadingBase?: KbLoadingBase;
  [key: string]: string | boolean | number | KbLoadingBase | undefined;

  constructor(config: IKbHttpExtraConfig = {}) {
    if (isNullOrUndefined(config.useApi)) {
      this.useApi = true;
    } else {
      this.useApi = config.useApi;
    }

    if (isNullOrUndefined(config.useToken)) {
      this.useToken = true;
    } else {
      this.useToken = config.useToken;
    }

    if (isNullOrUndefined(config.useMap)) {
      this.useMap = true;
    } else {
      this.useMap = config.useMap;
    }

    this.id = config.id;
    this.loadingBase = config.loadingBase;
  }
}

