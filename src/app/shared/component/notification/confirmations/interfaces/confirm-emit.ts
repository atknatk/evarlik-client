import {KbConfirmSettings} from './confirm-settings';

export interface KbConfirmEmit {
  close?: boolean;
  message?: string;
  title?: string;
  resolve$?: any;
  override?: KbConfirmSettings;
}
