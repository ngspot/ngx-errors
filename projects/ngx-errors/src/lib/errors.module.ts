import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  ShowOnSubmittedErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnTouchedErrorStateMatcher,
} from './error-state-matchers';
import { ErrorStateMatchers } from './error-state-matchers.service';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  IErrorsConfiguration,
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { SetMatInputErrorStateMatcherDirective } from './set-mat-input-error-state-matcher.directive';

const declarationsAndExports = [
  ErrorsDirective,
  ErrorDirective,
  SetMatInputErrorStateMatcherDirective,
];

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [...declarationsAndExports],
  exports: [...declarationsAndExports],
  providers: [
    ShowOnTouchedErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher,
    ShowOnTouchedAndDirtyErrorStateMatcher,
    ShowOnSubmittedErrorStateMatcher,
  ],
})
export class NgxErrorsModule {
  static configure(
    config?: IErrorsConfiguration
  ): ModuleWithProviders<NgxErrorsModule> {
    return {
      ngModule: NgxErrorsModule,
      providers: [
        {
          provide: ErrorsConfiguration,
          useValue: config,
        },
        {
          provide: ErrorStateMatcher,
          useFactory: (
            errorsConfiguration: ErrorsConfiguration,
            errorStateMatchers: ErrorStateMatchers
          ) => {
            return errorStateMatchers.get(
              errorsConfiguration.showErrorsWhenInput
            );
          },
          deps: [ErrorsConfiguration, ErrorStateMatchers],
        },
      ],
    };
  }
}
