import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KbConfirmationsComponent } from './confirmations.component';
import { KbConfirmationComponent } from './confirmation.component';
import { KbConfirmationService } from './confirmations.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    KbConfirmationsComponent,
    KbConfirmationComponent
  ],
  providers: [KbConfirmationService],
  exports: [KbConfirmationsComponent]
})
export class KbConfirmationsModule {
}
