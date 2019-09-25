import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KbLoadingConfigService } from './loading.service';
import { KbLoadingComponent } from './loading.component';
import { IKbLoadingConfig } from './Iloading.config';

@NgModule({
  imports: [CommonModule],
  exports: [KbLoadingComponent],
  declarations: [KbLoadingComponent],
  providers: [KbLoadingConfigService],
})
export class KbLoadingModule {
  static forRoot(loadingConfig: IKbLoadingConfig): ModuleWithProviders {
    return {
      ngModule: KbLoadingModule,
      providers: [{provide: 'loadingConfig', useValue: loadingConfig}]
    };
  }
}
