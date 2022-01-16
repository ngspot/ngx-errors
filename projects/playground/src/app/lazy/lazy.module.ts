import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxErrorsModule } from '@ngspot/ngx-errors';
import { CUSTOM_ERROR_STATE_MATCHERS_PROVIDER } from '../custom-matchers/provider';
import { LazyRoutingModule } from './lazy-routing.module';
import { LazyComponent } from './lazy.component';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    CommonModule,
    LazyRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    NgxErrorsModule.configure({
      showErrorsWhenInput: 'touched',
    }),
  ],
  providers: [CUSTOM_ERROR_STATE_MATCHERS_PROVIDER],
})
export class LazyModule {}
