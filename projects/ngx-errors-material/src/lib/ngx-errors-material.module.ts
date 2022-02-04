import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorsConfiguration, ErrorStateMatchers } from '@ngspot/ngx-errors';
import { SetMatInputErrorStateMatcherDirective } from './set-mat-input-error-state-matcher.directive';

const declarationsAndExports = [SetMatInputErrorStateMatcherDirective];

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [...declarationsAndExports],
  exports: [...declarationsAndExports],
  providers: [
    {
      provide: ErrorStateMatcher,
      useFactory: (
        errorsConfiguration: ErrorsConfiguration,
        errorStateMatchers: ErrorStateMatchers
      ) => {
        return errorStateMatchers.get(errorsConfiguration.showErrorsWhenInput);
      },
      deps: [ErrorsConfiguration, ErrorStateMatchers],
    },
  ],
})
export class NgxErrorsMaterialModule {}
