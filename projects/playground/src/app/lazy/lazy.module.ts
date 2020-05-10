import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '../../../../ngx-errors/src/public-api';
import { LazyRoutingModule } from './lazy-routing.module';
import { LazyComponent } from './lazy.component';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    CommonModule,
    LazyRoutingModule,
    ReactiveFormsModule,
    NgxErrorsModule.configure({
      showErrorsWhenFormSubmitted: true,
    }),
  ],
})
export class LazyModule {}
