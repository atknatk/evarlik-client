import { IKbLoadingConfig } from './Iloading.config';

export class KbLoadingConfig implements IKbLoadingConfig {
  backdropBorderRadius?: string;
  backdropBackgroundColour?: string;
  fullScreenBackdrop?: boolean;
  animationType?: string;
  primaryColour?: string;
  secondaryColour?: string;
  tertiaryColour?: string;
  [key: string]: string | boolean | undefined;

  constructor(config: IKbLoadingConfig = {}) {
    this.backdropBorderRadius = config.backdropBorderRadius;
    this.backdropBackgroundColour = config.backdropBackgroundColour;
    this.fullScreenBackdrop = config.fullScreenBackdrop;
    this.animationType = config.animationType;
    this.primaryColour = config.primaryColour;
    this.secondaryColour = config.secondaryColour;
    this.tertiaryColour = config.tertiaryColour;
  }
}
