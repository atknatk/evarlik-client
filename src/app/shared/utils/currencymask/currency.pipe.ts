import {Pipe, PipeTransform} from '@angular/core';
import {currencyTrim} from "../utils";

@Pipe({name: 'evCurrency'})
export class CurrencyPipe implements PipeTransform {

  transform(value: string, args: string[]): any {
    return currencyTrim(value);
  }
}
