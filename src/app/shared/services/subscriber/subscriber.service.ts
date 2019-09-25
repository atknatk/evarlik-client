import {Injectable} from "@angular/core";

@Injectable()
export class SubscriberService {

  _subscribeList = new Map<string, Function[]>();

  addSubscribe(key, func: Function) {
    if (this._subscribeList.has(key)) {
      const arr = this._subscribeList.get(key);
      arr.push(func);
      this._subscribeList.set(key, arr);
    } else {
      const arr = [];
      arr.push(func);
      this._subscribeList.set(key, arr);
    }
  }

  emit(key, ...args) {
    const arr = this._subscribeList.get(key);
    arr.forEach(fn => {
      fn(args);
    });
  }


}
