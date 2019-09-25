import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[evCurrency]'
})
export class CurrencyDirective {

  @Input() evCurrency: boolean;

  constructor(private el: ElementRef) {
  }

  appendValue(e: KeyboardEvent, value) {
    e.target['value'] = e.target['value'] + value;
  }

  getValue(e: KeyboardEvent) {
    return e.target['value'];
  }


  hasDot(e: KeyboardEvent): boolean {
    const value = e.target['value'];
    return value.indexOf('.') !== -1;
  }

  @HostListener('focus', ['$event'])
  onFocus(event) {
    if (+event.target.value == 0) {
      event.target.select();
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    if (event.target.value == '') {
      event.target.value = 0;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.evCurrency) {

      // Virgül ise
      if (e.keyCode === 110) {
        if (this.hasDot(e)) {
          e.preventDefault();
          return;
        } else {
          this.appendValue(e, '.');
          e.preventDefault();
          return;
        }
      }

      // Nokta ise
      if (e.keyCode === 190) {
        if (this.hasDot(e)) {
          e.preventDefault();
          return;
        }
      }


      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }

      // virgulden sonra
      // if (this.hasDot(e) && this.getValue(e).split('.')[1].length === 8) {
      //   e.preventDefault();
      // }
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event) {
    const e = <KeyboardEvent> event;
    // virgulden sonra
    if (this.hasDot(e) && this.getValue(e).split('.')[1].length > 8) {
      e.target['value'] = (+this.getValue(e)).toFixed(8);
    }

    // arttır
    if (e.keyCode === 38) {
      //  this.arttir(e);
    }

    // azalt
    if (e.keyCode === 40) {
      //  this.azalt(e);
    }

    e.preventDefault();
  }

  setValue(e: any, value) {
    e.target['value'] = value;
  }

  private arttir(e: any) {
    const val = e.target.value;
    if (val === '' || val === 0) {
      this.setValue(e, 1);
      return;
    }
    const ondalik = this.getOndalikBasamak(val);
    if (ondalik > 0) {
      const artim = 1 / Math.pow(10, ondalik - 1);
      this.setValue(e, (+val) + artim);
    } else {
      this.setValue(e, (+val) + 1);
    }

  }

  private azalt(e: any) {
    const val = e.target.value;
    if (val === '' || val === 0) {
      this.setValue(e, 0.9);
      return;
    }
    const ondalik = this.getOndalikBasamak(val);
    if (ondalik > 0) {
      const artim = 1 / Math.pow(10, ondalik);
      this.setValue(e, (+val) - artim);
    } else {
      this.setValue(e, (+val) - 1);
    }
  }

  private getOndalikBasamak(value) {
    if (value.indexOf('.') === -1) {
      return 0;
    }

    return value.split('.')[1].length;
  }
}
