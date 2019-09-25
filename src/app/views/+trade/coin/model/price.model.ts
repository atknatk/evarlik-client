import { isNullOrUndefined } from 'util';

export interface IPriceModel {
  idCoinType: string;
  coinUnitPrice: number;
  isIncreasing: boolean;
  ratio: number;
}

export class PriceModel {
  idCoinType: string;
  coinUnitPrice: number;
  isIncreasing: boolean;
  ratio: number;

  constructor(idCoinType, coinUnitPrice?: number, isIncreasing ?: boolean, ratio?: number) {
    this.idCoinType = idCoinType;
    this.coinUnitPrice = coinUnitPrice || 0.00;
    this.isIncreasing = isNullOrUndefined(isIncreasing) ? false : isIncreasing;
    this.ratio = ratio || 0.00;
  }
}
