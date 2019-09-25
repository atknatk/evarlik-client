import { Injectable } from '@angular/core';


@Injectable()
export class CacheService {
  private map = new Map<string, any>();
  private cp = new Map<string, any[]>();

  getValue(key) {
    return this.map.get(key);
  }

  setValue(key, value) {
    this.map.set(key, value);
    if (this.cp.has(key)) {
      const arr = this.cp.get(key);
      arr.forEach(fb => {
        fb(value);
      });
    }
  }

  isExist(key) {
    return this.map.has(key);
  }

  setValueEvent(key: string, fn: any) {
    if (this.cp.has(key)) {
      const arr = this.cp.get(key);
      arr.push(fn);
      this.cp.set(key, arr);
    } else {
      this.cp.set(key, [fn]);
    }
  }


}
