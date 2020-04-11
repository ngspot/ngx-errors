import { NgModule } from '@angular/core';
import { NgxErrorsComponent } from './ngx-errors.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [NgxErrorsComponent],
  exports: [NgxErrorsComponent],
})
export class NgxErrorsModule {}
