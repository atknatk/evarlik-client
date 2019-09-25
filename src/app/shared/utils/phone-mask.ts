declare const $: any;

export function phoneMask(id) {
  $('#' + id).mask('(599) 999-9999');
}

export function getPhoneMaskValue(value) {
  return value.replace('(', '')
    .replace(')', '')
    .replace(' ', '')
    .replace('-', '');
}
