import { Injectable } from '@angular/core';

declare const $: any;

@Injectable()
export class SocketService {

  private _socket;
  private priceEventList = [];
  private orderEventList = [];
  private orderHubEventList = [];
  private onConnectedEventList = [];
  private lastPriceVal;
  private _orderHub;

  constructor() {
    $.getScript('signalr/hubs')
      .done(() => {
        this._socket = $.connection;
        const coinPrice = this._socket.coinPriceHub;
        this._orderHub = this._socket.orderHub;

        coinPrice.client.getPrice = (val) => {
          this.lastPriceVal = val;
          this.priceEventList.forEach(cb => {
            cb(JSON.parse(val));
          });
        };

        this._orderHub.client.getOrder = (val) => {
          this.orderEventList.forEach(cb => {
            cb(JSON.parse(val));
          });
        };

        $.connection.hub.disconnected(() => {
          setTimeout(() => {
            $.connection.hub.start();
          }, 5000);
        });

        this._socket.hub.start().done(() => {
          coinPrice.server.subscribe();
          this.orderHubEventList.forEach(cb => {
            cb(this._orderHub);
          });
          this.onConnectedEventList.forEach(cb => {
            cb();
          });
        });

      });
  }

  getSocket() {
    return this._socket;
  }

  load() {

  }


  getOrderHub(fn) {
    if (this._orderHub) {
      fn(this._orderHub);
    } else {
      this.orderHubEventList.push(fn);
    }
  }

  subscribePrice(fn) {
    if (this.lastPriceVal) {
      fn(this.lastPriceVal);
    }
    this.priceEventList.push(fn);
  }

  subscribeOrder(fn) {
    this.orderEventList.push(fn);
  }

  onConnected(fn) {
    this.onConnectedEventList.push(fn);
  }

}
