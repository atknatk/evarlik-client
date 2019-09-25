import { Injectable } from '@angular/core';
import { evarlikConfig } from '../../evarlik.config';
import { EvStorageService } from '../storage/storage.service';
import { isNullOrUndefined } from 'util';

@Injectable()
export class EvTokenService {

  private token;

  constructor(private _storage: EvStorageService) {
  }


  getToken(): string {
    if (this.token) {
      return this.token;
    }
    const user: any = this._storage.getItem(evarlikConfig.authUserKey);
    if (user) {
      this.token = user.token;
      return user.token;
    }
    return;
  }

  clearToken(): void {
    this.token = null;
    this._storage.removeItem(evarlikConfig.authUserKey);
  }

  setToken(authToken: string): void {
    this.token = authToken;
    const user: any = this._storage.getItem(evarlikConfig.authUserKey);
    if (user) {
      user.token = authToken;
    }
    this._storage.setItem(evarlikConfig.authUserKey, user);
  }

  isAuthorized(): boolean {
    return !isNullOrUndefined(this.token);
  }

}
