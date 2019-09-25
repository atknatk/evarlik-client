import {isNullOrUndefined} from 'util';

declare const $: any;

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}


export function deepCopy(val) {
  return $.extend(true, {}, val);
}


export function currencyTrim(value): string {

  if (isNullOrUndefined(value) || value == '' || isNaN(+value)) {
    return '0.00';
  }
  let retValue = value + '';

  const hasDot = retValue.indexOf('.') > -1;

  if (hasDot === true) {
    const sol = retValue.split('.')[0];
    let sag = retValue.split('.')[1];
    sag = sag.substring(0, 8);
    sag = normalizePrecision(sag);
    if (sag === '') {
      sag = '00';
    }
    retValue = `${sol}.${sag}`;
  } else {
    retValue = retValue + '.00';
  }

  return retValue;
}


function normalizePrecision(value: string) {
  if (!isNullOrUndefined(value) && value != '' && value.endsWith('0')) {
    value = value.substring(0, value.length - 1);
    return normalizePrecision(value);
  }
  return value;
}


export function multiplyFixed(value1: any, value2: any): number {
  const _val1 = +currencyTrim(value1);
  const _val2 = +currencyTrim(value2);
  return +((+(_val1 * _val2).toFixed(8)));
}
